import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    fetchUserEvents,
    deleteEvent,
    addAttendee,
    removeAttendee,
    updateEvent,
} from "@/app/features/events/eventSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

const EventList = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const events = useSelector((state) => state.events.events);
    const [showForm, setShowForm] = useState(false);
    const [newEvent, setNewEvent] = useState({});
    const [currentEventId, setCurrentEventId] = useState(null);
    const [attendeeEmails, setAttendeeEmails] = useState({});

    useEffect(() => {
        if (user) {
            dispatch(fetchUserEvents(user.id));
        }
    }, [dispatch, user]);

    const handleDelete = (eventId) => {
        if (window.confirm(`Are you sure you want to remove this event?`)) {
            dispatch(deleteEvent(eventId));
        }
    };

    const handleFormChange = (e) => {
        setNewEvent({
            ...newEvent,
            [e.target.name]: e.target.value,
        });
    };

    const getCurrentDateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };
    const currentDateTime = getCurrentDateTime();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentEventId) {
            dispatch(updateEvent({ eventId: currentEventId, event: newEvent }));
            setShowForm(false);
        }
    };

    const handleUpdateShow = (event) => {
        setShowForm(true);
        setCurrentEventId(event._id);
        setNewEvent({
            title: event.title,
            description: event.description,
            date: event.date,
            location: event.location,
        });
    };

    const handleEmailChange = (eventId, email) => {
        setAttendeeEmails({
            ...attendeeEmails,
            [eventId]: email,
        });
    };

    const handleAddAttendee = (eventId) => {
        const email = attendeeEmails[eventId];
        if (email) {
            dispatch(addAttendee({ eventId, email }));
            setAttendeeEmails({ ...attendeeEmails, [eventId]: "" });
        } else {
            alert("Please enter a valid email address.");
        }
    };

    const handleRemoveAttendee = (eventId) => {
        const email = attendeeEmails[eventId];
        if (email) {
            dispatch(removeAttendee({ eventId, email }))
                .then(() => {
                    dispatch(fetchUserEvents(user.id));
                });
            setAttendeeEmails({ ...attendeeEmails, [eventId]: "" });
        } else {
            alert("Please enter a valid email address.");
        }
    };

    const handleRemoveAttendeeList = (eventId, email) => {
        if (window.confirm(`Are you sure you want to remove ${email}?`)) {
            dispatch(removeAttendee({ eventId, email }))
                .then(() => {
                    dispatch(fetchUserEvents(user.id));
                });
        }
    }
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Your Events</h1>

            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    className="mt-4 p-4 border border-gray-300 rounded bg-white shadow-sm"
                >
                    <h2 className="text-xl font-semibold mb-4">Update Event</h2>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                            type="text"
                            name="title"
                            value={newEvent.title || ""}
                            onChange={handleFormChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            name="description"
                            value={newEvent.description || ""}
                            onChange={handleFormChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            rows="3"
                            maxLength={100}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Date and Time</label>
                        <input
                            type="datetime-local"
                            name="date"
                            value={newEvent.date || ""}
                            onChange={handleFormChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            min={currentDateTime}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={newEvent.location || ""}
                            onChange={handleFormChange}
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <Button type="submit" variant="secondary">
                        Submit
                    </Button>
                </form>
            )}
            {!showForm && (
                <>
                    <div className="space-y-6">
                        {events.map((event) => (
                            <div key={event._id} className="border rounded-lg p-4 mb-4">
                                <h2 className="text-2xl font-semibold">{event.title}</h2>
                                <p className="text-gray-700">
                                    Date: {format(new Date(event.date), "MMMM d, yyyy 'at' h:mm a")}
                                </p>
                                <div className="mt-4">
                                    <Button
                                        onClick={() => handleUpdateShow(event)}
                                        className="mr-2"
                                        variant="secondary"
                                    >
                                        Update
                                    </Button>
                                    <Button
                                        onClick={() => handleDelete(event._id)}
                                        variant="secondary"
                                        className="mr-2"
                                    >
                                        Delete
                                    </Button>
                                    <Input
                                        type="email"
                                        value={attendeeEmails[event._id] || ""}
                                        onChange={(e) => handleEmailChange(event._id, e.target.value)}
                                        placeholder="Add attendee by email"
                                        className="mt-2"
                                        style={{ color: "white" }}
                                    />
                                    <Button
                                        onClick={(e) =>
                                            handleRemoveAttendee(event._id, e.target.previousSibling.value)
                                        }
                                        variant="secondary"
                                        className="mt-2"
                                    >
                                        Remove Attendee
                                    </Button>

                                    <Button
                                        onClick={() =>
                                            handleAddAttendee(event._id)
                                        }
                                        variant="secondary"
                                        className="mt-2 ml-2"
                                    >
                                        Add Attendee
                                    </Button>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold">Attendees:</h3>
                                    <ul className="list-disc pl-5">
                                        {event.attendees.map((attendee) => (
                                            <li key={attendee.userId} className="flex justify-between">
                                                <span>{attendee.email}</span>
                                                <Button
                                                    onClick={() => handleRemoveAttendeeList(event._id, attendee.email)}
                                                    variant="secondary"
                                                >
                                                    Remove
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default EventList;
