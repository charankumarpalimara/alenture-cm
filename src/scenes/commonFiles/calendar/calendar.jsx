import React, { useState, useEffect } from "react";
import {
  Typography,
  Modal,
  Button,
  Input,
  DatePicker,
  Form,
  Row,
  Col,
  List,
  Card,
  message,
  Switch,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "antd/dist/reset.css";
import { isSameDay } from "date-fns";
import axios from "axios";
import dayjs from "dayjs";
import { getCreaterId, getCreaterRole } from "../../../config";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";

// Helpers for date and time
function formatDate(dt) {
  return dt ? dayjs(dt).format("YYYY-MM-DD") : null;
}
function formatTime(dt) {
  return dt ? dayjs(dt).format("HH:mm:ss") : null;
}

// Date-fns localizer for BigCalendar
const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const eventColors = [
  "#1976d2", "#43a047", "#fbc02d", "#d32f2f", "#8e24aa",
];

// --- API functions ---
const api = {
  async fetchEvents() {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_URL}/v1/events/${getCreaterId()}`
    );
    // Convert DB fields to react-big-calendar format
    return data.map((e) => ({
      id: e.id,
      title: e.event,
      start:
        e.eventstartdate && e.eventstarttime
          ? new Date(`${e.eventstartdate}T${e.eventstarttime}`)
          : e.eventstartdate
          ? new Date(`${e.eventstartdate}T00:00:00`)
          : null,
      end:
        e.eventenddate && e.eventendtime
          ? new Date(`${e.eventenddate}T${e.eventendtime}`)
          : e.eventenddate
          ? new Date(`${e.eventenddate}T23:59:59`)
          : null,
      color: e.color || eventColors[0],
      allDay: !!e.allDay,
      eventstartdate: e.eventstartdate,
      eventenddate: e.eventenddate,
      eventstarttime: e.eventstarttime,
      eventendtime: e.eventendtime,
      raw: e,
    }));
  },
  async addEvent(event) {
    const now = new Date();
    const payload = {
      userid: getCreaterId(),
      userrole: getCreaterRole(),
      event: event.title,
      eventstartdate: formatDate(event.start),
      eventenddate: formatDate(event.end),
      eventstarttime: formatTime(event.start),
      eventendtime: formatTime(event.end),
      time: now.toLocaleTimeString(),
      date: now.toLocaleDateString(),
      color: event.color,
      allDay: event.allDay,
    };
    const { data } = await axios.post(
      `${process.env.REACT_APP_API_URL}/v1/addEvent`,
      payload
    );
    return {
      id: data.id,
      title: data.event,
      start:
        data.eventstartdate && data.eventstarttime
          ? new Date(`${data.eventstartdate}T${data.eventstarttime}`)
          : data.eventstartdate
          ? new Date(`${data.eventstartdate}T00:00:00`)
          : null,
      end:
        data.eventenddate && data.eventendtime
          ? new Date(`${data.eventenddate}T${data.eventendtime}`)
          : data.eventenddate
          ? new Date(`${data.eventenddate}T23:59:59`)
          : null,
      color: data.color || eventColors[0],
      allDay: !!data.allDay,
      eventstartdate: data.eventstartdate,
      eventenddate: data.eventenddate,
      eventstarttime: data.eventstarttime,
      eventendtime: data.eventendtime,
      raw: data,
    };
  },
  async updateEvent(id, event) {
    const payload = {
      event: event.title,
      eventstartdate: formatDate(event.start),
      eventenddate: formatDate(event.end),
      eventstarttime: formatTime(event.start),
      eventendtime: formatTime(event.end),
      color: event.color,
      allDay: event.allDay,
    };
    const { data } = await axios.put(
      `${process.env.REACT_APP_API_URL}/v1/EditEvent/${id}`,
      payload
    );
    return {
      id: data.id,
      title: data.event,
      start:
        data.eventstartdate && data.eventstarttime
          ? new Date(`${data.eventstartdate}T${data.eventstarttime}`)
          : data.eventstartdate
          ? new Date(`${data.eventstartdate}T00:00:00`)
          : null,
      end:
        data.eventenddate && data.eventendtime
          ? new Date(`${data.eventenddate}T${data.eventendtime}`)
          : data.eventenddate
          ? new Date(`${data.eventenddate}T23:59:59`)
          : null,
      color: data.color || eventColors[0],
      allDay: !!data.allDay,
      eventstartdate: data.eventstartdate,
      eventenddate: data.eventenddate,
      eventstarttime: data.eventstarttime,
      eventendtime: data.eventendtime,
      raw: data,
    };
  },
  async deleteEvent(id) {
    await axios.delete(`${process.env.REACT_APP_API_URL}/v1/DeleteEvent/${id}`);
    return true;
  },
};

const Calendar = () => {
  const theme = useTheme();
  const [currentEvents, setCurrentEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const colors = tokens(theme.palette.mode);

  const [form] = Form.useForm();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const events = await api.fetchEvents();
      setCurrentEvents(events);
    } catch (err) {
      message.error("Failed to fetch events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSlotSelect = ({ start, end }) => {
    setEditMode(false);
    form.resetFields();
    setSelectedEvent(null);
    form.setFieldsValue({
      title: "",
      start: dayjs(start),
      end: dayjs(end),
      allDay: false,
    });
    setModalVisible(true);
  };

  const handleEventClick = (event) => {
    if (!event) {
      message.error("Event data missing.");
      return;
    }
    setEditMode(true);
    setSelectedEvent(event);
    form.setFieldsValue({
      title: event.title,
      start: event.start ? dayjs(event.start) : null,
      end: event.end ? dayjs(event.end) : null,
      allDay: !!event.allDay,
    });
    setModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (!values.start || !values.start.isValid()) {
        message.error("Please select a valid start date and time.");
        return;
      }
      const start = values.start.toDate();
      const end = values.end && values.end.isValid() ? values.end.toDate() : null;

      const eventPayload = {
        title: values.title,
        start,
        end,
        color: selectedEvent?.color || eventColors[0],
        allDay: values.allDay,
      };

      if (editMode && selectedEvent && selectedEvent.id) {
        const saved = await api.updateEvent(selectedEvent.id, eventPayload);
        setCurrentEvents((events) =>
          events.map((e) => (e.id === selectedEvent.id ? saved : e))
        );
        message.success("Event updated!");
      } else if (editMode && (!selectedEvent || !selectedEvent.id)) {
        message.error("Event ID missing. Cannot update.");
        return;
      } else {
        const color = eventColors[Math.floor(Math.random() * eventColors.length)];
        const newEvent = { ...eventPayload, color };
        const saved = await api.addEvent(newEvent);
        setCurrentEvents((events) => [...events, saved]);
        message.success("Event created!");
      }
      setModalVisible(false);
      form.resetFields();
      setSelectedEvent(null);
    } catch (err) {
      message.error("Operation failed.");
    }
  };

  const handleDeleteEvent = async () => {
    if (selectedEvent && selectedEvent.id) {
      try {
        await api.deleteEvent(selectedEvent.id);
        setCurrentEvents((events) =>
          events.filter((e) => e.id !== selectedEvent.id)
        );
        setModalVisible(false);
        form.resetFields();
        setSelectedEvent(null);
        message.success("Event deleted!");
      } catch (err) {
        message.error("Failed to delete event.");
      }
    } else {
      message.error("Event ID missing. Cannot delete.");
    }
  };

  const today = new Date();
  const todaysEvents = currentEvents.filter((e) => isSameDay(e.start, today));

  return (
    <div style={{ margin: 8, background: "#fff", borderRadius: 8, padding: 6 }}>
      <Typography.Title level={4} style={{ marginBottom: 16 }}>
        My Calendar
      </Typography.Title>
      <Row gutter={[16, 16]} wrap>
        <Col xs={24} md={7}>
          <Card
            title="Today's Events"
            size="small"
            bordered={false}
            style={{
              minHeight: 200,
              background: "#f3f6f9",
              borderRadius: 8,
              marginBottom: 12,
            }}
          >
            <List
              dataSource={todaysEvents}
              locale={{ emptyText: "No events today." }}
              renderItem={(event) => (
                <List.Item
                  style={{
                    background: event.color || "#1976d2",
                    color: "#fff",
                    borderRadius: 4,
                    marginBottom: 8,
                  }}
                >
                  <List.Item.Meta
                    title={<span style={{ color: "#fff" }}>{event.title}</span>}
                    description={
                      event.allDay
                        ? "All Day"
                        : (
                          <>
                            {event.eventstartdate && event.eventstarttime
                              ? `${event.eventstartdate} ${event.eventstarttime}`
                              : ""}
                            {event.eventenddate && event.eventendtime
                              ? ` - ${event.eventenddate} ${event.eventendtime}`
                              : ""}
                          </>
                        )
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} md={17}>
          <BigCalendar
            localizer={localizer}
            events={currentEvents}
            startAccessor="start"
            endAccessor="end"
            titleAccessor="title"
            style={{ height: "70vh", minHeight: 400 }}
            popup
            selectable
            onSelectSlot={handleSlotSelect}
            onSelectEvent={handleEventClick}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: event.color || "#1976d2",
                color: "#fff",
                borderRadius: "4px",
                border: "none",
                padding: "2px 6px",
              },
            })}
            views={["month", "week", "day", "agenda"]}
            dayLayoutAlgorithm="no-overlap"
            toolbar={true}
            loading={loading}
          />
        </Col>
      </Row>
      <Modal
        open={modalVisible}
        title={editMode ? "Edit Event" : "Add Event"}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setSelectedEvent(null);
        }}
        footer={[
          editMode && (
            <Button
              key="delete"
              
              icon={<DeleteOutlined />}
              danger
              className="form-button"
              onClick={handleDeleteEvent}
            >
              Delete
            </Button>
          ),
          <Button
            key="cancel"
            className="form-button"
            onClick={() => {
              setModalVisible(false);
              form.resetFields();
              setSelectedEvent(null);
            }}
          >
            Cancel
          </Button>,
          <Button
            key="ok"
            type="primary"
            icon={editMode ? <EditOutlined /> : <PlusOutlined />}
            className="form-button"
            style={{ background: colors.blueAccent[1000], color: "#fff" }}
            onClick={handleModalOk}
          >
            {editMode ? "Save" : "Add"}
          </Button>,
        ]}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            title: selectedEvent?.title || "",
            start: selectedEvent?.start ? dayjs(selectedEvent.start) : null,
            end: selectedEvent?.end ? dayjs(selectedEvent.end) : null,
            allDay: selectedEvent?.allDay || false,
          }}
        >
          <Form.Item
            name="title"
            label="Event Title"
            rules={[{ required: true, message: "Please enter a title" }]}
          >
            <Input autoFocus placeholder="Event Title" />
          </Form.Item>
          <Form.Item
            name="start"
            label="Start (pick date and time)"
            rules={[{ required: true, message: "Please select a start time" }]}
          >
            <DatePicker
              showTime
              style={{ width: "100%" }}
              format="YYYY-MM-DD HH:mm"
            />
          </Form.Item>
          <Form.Item name="end" label="End (pick date and time)">
            <DatePicker
              showTime
              style={{ width: "100%" }}
              format="YYYY-MM-DD HH:mm"
            />
          </Form.Item>
          <Form.Item name="allDay" label="All Day" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Calendar;