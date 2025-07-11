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
  Space,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import localeEn from "@fullcalendar/core/locales/en-gb";
import moment from "moment";
import axios from "axios";
import "antd/dist/reset.css";
import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import "@fullcalendar/list/main.css";

// Helper for event colors
const eventColors = [
  "#1976d2", // blue
  "#43a047", // green
  "#fbc02d", // yellow
  "#d32f2f", // red
  "#8e24aa", // purple
];

const Calendar = () => {
  const [currentEvents, setCurrentEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  // Fetch events from API on mount and after any change
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/events");
      setCurrentEvents(res.data);
    } catch (err) {
      // message.error("Failed to fetch events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle selecting a slot to add event
  const handleDateSelect = (selectInfo) => {
    setEditMode(false);
    form.resetFields();
    setSelectedEvent({
      start: selectInfo.startStr,
      end: selectInfo.endStr || selectInfo.startStr,
      allDay: selectInfo.allDay,
    });
    setModalVisible(true);
  };

  // Handle clicking an event (open modal for edit/delete)
  const handleEventClick = (clickInfo) => {
    setEditMode(true);
    setSelectedEvent({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.startStr,
      end: clickInfo.event.endStr || clickInfo.event.startStr,
      allDay: clickInfo.event.allDay,
      color: clickInfo.event.backgroundColor,
    });
    form.setFieldsValue({
      title: clickInfo.event.title,
      start: moment(clickInfo.event.start),
      end: clickInfo.event.end ? moment(clickInfo.event.end) : undefined,
      allDay: clickInfo.event.allDay,
    });
    setModalVisible(true);
  };

  // Save (add/edit) event
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const start = values.start.format("YYYY-MM-DDTHH:mm:ss");
      const end = values.end ? values.end.format("YYYY-MM-DDTHH:mm:ss") : undefined;

      if (editMode && selectedEvent) {
        // EDIT EVENT
        const updatedEvent = {
          ...selectedEvent,
          title: values.title,
          start,
          end,
          allDay: values.allDay,
        };
        await axios.put(`${process.env.REACT_APP_API_URL}/v1/events/${selectedEvent.id}`, updatedEvent); // <-- Your API endpoint
        // message.success("Event updated!");
      } else {
        // ADD EVENT
        const color = eventColors[Math.floor(Math.random() * eventColors.length)];
        const newEvent = {
          title: values.title,
          start,
          end,
          allDay: values.allDay,
          color,
        };
        await axios.post(`${process.env.REACT_APP_API_URL}/v1/events`, newEvent); // <-- Your API endpoint
        message.success("Event created!");
      }
      setModalVisible(false);
      form.resetFields();
      fetchEvents();
    } catch (err) {
      // Validation error or API error
      if (err && err.response && err.response.data && err.response.data.error) {
        message.error(err.response.data.error);
      }
    }
  };

  // Delete event
  const handleDeleteEvent = async () => {
    if (selectedEvent && selectedEvent.id) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/v1/events/${selectedEvent.id}`); // <-- Your API endpoint
        // message.success("Event deleted!");
        setModalVisible(false);
        form.resetFields();
        fetchEvents();
      } catch {
        // message.error("Failed to delete event.");
      }
    }
  };

  // Today's events for sidebar
  const today = moment().format("YYYY-MM-DD");
  const todaysEvents = currentEvents.filter((e) =>
    e.start ? e.start.slice(0, 10) === today : false
  );

  return (
    <div style={{ margin: 16, background: "#fff", borderRadius: 8, padding: 12 }}>
      <Typography.Title level={4} style={{ marginBottom: 16 }}>
        My Calendar
      </Typography.Title>
      <Row gutter={[16, 16]} wrap>
        {/* Sidebar */}
        <Col xs={24} md={6}>
          <Card
            title="Today's Events"
            size="small"
            bordered={false}
            style={{ minHeight: 300, background: "#f3f6f9", borderRadius: 8 }}
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
                            {moment(event.start).format("HH:mm")}
                            {event.end ? ` - ${moment(event.end).format("HH:mm")}` : ""}
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
        <Col xs={24} md={18}>
          <FullCalendar
            height="70vh"
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            events={currentEvents}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventColor="#1976d2"
            locale={localeEn}
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
            start: selectedEvent?.start ? moment(selectedEvent.start) : undefined,
            end: selectedEvent?.end ? moment(selectedEvent.end) : undefined,
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
        </Form>
      </Modal>
    </div>
  );
};

export default Calendar;