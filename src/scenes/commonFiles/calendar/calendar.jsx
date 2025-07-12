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
import { getCreaterId, getCreaterRole } from "../../../config";

// Date-fns localizer for BigCalendar
const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Helper for event colors
const eventColors = [
  "#1976d2", // blue
  "#43a047", // green
  "#fbc02d", // yellow
  "#d32f2f", // red
  "#8e24aa", // purple
];

// --- API functions ---
// You MUST replace the URLs with your actual backend API endpoints.
const api = {
  async fetchEvents() {
    // Replace with your backend endpoint:
    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/events/${getCreaterId()}`);
    // The backend should return an array of events.
    // Each event: { id, title, start, end, allDay, color }
    // Dates should be ISO strings; convert to Date objects:
    return data.map(e => ({
      ...e,
      start: new Date(e.start),
      end: e.end ? new Date(e.end) : undefined,
    }));
  },
  async addEvent(event) {
    const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/events`, event);
    return { ...data, start: new Date(data.start), end: data.end ? new Date(data.end) : undefined };
  },
  async updateEvent(id, event) {
    const { data } = await axios.put(`${process.env.REACT_APP_API_URL}/api/events/${id}`, event);
    return { ...data, start: new Date(data.start), end: data.end ? new Date(data.end) : undefined };
  },
  async deleteEvent(id) {
    await axios.delete(`${process.env.REACT_APP_API_URL}/api/events/${id}`);
    return true;
  },
};

const Calendar = () => {
  const [currentEvents, setCurrentEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  // Fetch events from API on mount and after any change
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

  // Handle selecting a slot to add event
  const handleSlotSelect = ({ start, end }) => {
    setEditMode(false);
    form.resetFields();
    setSelectedEvent({
      start,
      end,
      allDay: false,
    });
    form.setFieldsValue({
      start,
      end,
      allDay: false,
    });
    setModalVisible(true);
  };

  // Handle clicking an event (open modal for edit/delete)
  const handleEventClick = ({ event }) => {
    setEditMode(true);
    setSelectedEvent(event);
    form.setFieldsValue({
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: event.allDay,
    });
    setModalVisible(true);
  };

  // Save (add/edit) event
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const { title, start, end, allDay } = values;

      if (editMode && selectedEvent) {
        // EDIT EVENT
        const updatedEvent = {
          title,
          start: start.toISOString(),
          end: end ? end.toISOString() : null,
          allDay,
          color: selectedEvent.color || eventColors[0],
        };
        const saved = await api.updateEvent(selectedEvent.id, updatedEvent);
        setCurrentEvents((events) =>
          events.map((e) => (e.id === selectedEvent.id ? saved : e))
        );
        message.success("Event updated!");
      } else {
        // ADD EVENT
        const color = eventColors[Math.floor(Math.random() * eventColors.length)];
        const newEvent = {
          title,
          start: start.toISOString(),
          end: end ? end.toISOString() : null,
          allDay,
          color,
        };
        const saved = await api.addEvent(newEvent);
        setCurrentEvents((events) => [...events, saved]);
        message.success("Event created!");
      }
      setModalVisible(false);
      form.resetFields();
    } catch (err) {
      // Validation error or API error
      message.error("Operation failed.");
    }
  };

  // Delete event
  const handleDeleteEvent = async () => {
    if (selectedEvent && selectedEvent.id) {
      try {
        await api.deleteEvent(selectedEvent.id);
        setCurrentEvents((events) =>
          events.filter((e) => e.id !== selectedEvent.id)
        );
        setModalVisible(false);
        form.resetFields();
        message.success("Event deleted!");
      } catch (err) {
        message.error("Failed to delete event.");
      }
    }
  };

  // Today's events for sidebar
  const today = new Date();
  const todaysEvents = currentEvents.filter((e) =>
    isSameDay(e.start, today)
  );

  return (
    <div style={{ margin: 8, background: "#fff", borderRadius: 8, padding: 6 }}>
      <Typography.Title level={4} style={{ marginBottom: 16 }}>
        My Calendar
      </Typography.Title>
      <Row gutter={[16, 16]} wrap>
        {/* Sidebar */}
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
                            {format(event.start, "HH:mm")}
                            {event.end ? ` - ${format(event.end, "HH:mm")}` : ""}
                          </>
                        )
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        {/* Calendar */}
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

      {/* Modal for Add/Edit */}
      <Modal
        open={modalVisible}
        title={editMode ? "Edit Event" : "Add Event"}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={[
          editMode && (
            <Button key="delete" icon={<DeleteOutlined />} danger onClick={handleDeleteEvent}>
              Delete
            </Button>
          ),
          <Button key="cancel" onClick={() => {
            setModalVisible(false);
            form.resetFields();
          }}>
            Cancel
          </Button>,
          <Button key="ok" type="primary" icon={editMode ? <EditOutlined /> : <PlusOutlined />} onClick={handleModalOk}>
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
            start: selectedEvent?.start,
            end: selectedEvent?.end,
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
            label="Start"
            rules={[{ required: true, message: "Please select a start time" }]}
          >
            <DatePicker
              showTime
              style={{ width: "100%" }}
              format="YYYY-MM-DD HH:mm"
            />
          </Form.Item>
          <Form.Item
            name="end"
            label="End"
          >
            <DatePicker
              showTime
              style={{ width: "100%" }}
              format="YYYY-MM-DD HH:mm"
            />
          </Form.Item>
          <Form.Item
            name="allDay"
            label="All Day"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Calendar;