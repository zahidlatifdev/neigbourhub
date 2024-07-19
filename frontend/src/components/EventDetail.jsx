import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventById, deleteEvent, updateEvent, addAttendee, removeAttendee } from "@/app/features/events/eventSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

const EventDetails = () => {
  const { id } = useParams()
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const user = useSelector(state => state.auth.user);
  const [event, setEvent] = useState(null);
  const [newAttendeeEmail, setNewAttendeeEmail] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({})

  useEffect(() => {
    dispatch(fetchEventById(id)).then(response => {
      if (response.payload) {
        setEvent(response.payload);
      }
    });
  }, [id, dispatch, event]);

  if (!event) return <div>Loading...</div>;

  const isCreator = user && event.author._id === user.id;

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      dispatch(deleteEvent(event._id));
      navigator('/events');
    }
  };

  const handleUpdate = () => {
    setShowForm(true);
    setNewEvent({
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
    });
  };

  const handleFormChange = (e) => {
    setNewEvent({
      ...newEvent,
      [e.target.name]: e.target.value,
    });
  }

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  const currentDateTime = getCurrentDateTime();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateEvent({ eventId: event._id, event: newEvent }));
    setShowForm(false);
  }

  const handleAddAttendee = () => {
    if (newAttendeeEmail) {
      dispatch(addAttendee({ eventId: event._id, email: newAttendeeEmail }));
      setNewAttendeeEmail('');
    }
  };

  const handleRemoveAttendee = (email) => {
    if (window.confirm(`Are you sure you want to remove ${email}?`)) {
      dispatch(removeAttendee({ eventId: event._id, email }));
    }
  };

  return (


    <div className="container mx-auto px-4 py-8 bg-white shadow-md rounded-lg">

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-4 p-4 border border-gray-300 rounded bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Update Event</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={newEvent.title}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={newEvent.description}
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
              value={newEvent.date}
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
              value={newEvent.location}
              onChange={handleFormChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <Button type="submit" variant="secondary">Submit</Button>
        </form>
      )}

      {
        !showForm && (
          <>
            <h1 className="text-3xl font-bold mb-4 text-gray-900">{event.title}</h1>
            <p className="text-gray-700 mb-2"><strong>Description:</strong> {event.description}</p>
            <p className="text-gray-700 mb-2"><strong>Location:</strong> {event.location}</p>
            <p className="text-gray-700 mb-4"><strong>Date:</strong> {format(new Date(event.date), "MMMM d, yyyy 'at' h:mm a")}</p>

            <h2 className="text-xl font-semibold mt-6 mb-4 text-gray-800">Attendees:</h2>
            <ul className="list-disc pl-5 mb-4 space-y-2">
              {event.attendees.length > 0 ? (
                event.attendees.map(attendee => (
                  <li key={attendee.email} className="flex items-center justify-between text-gray-700">
                    <span>{attendee.name} {isCreator && `(${attendee.email})`}</span>
                    {isCreator && (
                      <Button
                        onClick={() => handleRemoveAttendee(attendee.email)}
                        variant="secondary"
                        className="ml-2"
                      >
                        Remove
                      </Button>
                    )}
                  </li>
                ))
              ) : (
                <li className="text-gray-700">No attendees yet.</li>
              )}
            </ul>

            {isCreator && (
              <div className="mt-4 flex flex-col space-y-4">
                <div className="flex items-center space-x-2">
                  <Input
                    type="email"
                    placeholder="Add attendee by email"
                    value={newAttendeeEmail}
                    onChange={(e) => setNewAttendeeEmail(e.target.value)}
                    className="flex-grow"
                    style={{ color: 'white' }}
                  />
                  <Button onClick={handleAddAttendee} variant="secondary">Add Attendee</Button>
                </div>
                <div className="flex space-x-4">
                  <Button onClick={handleUpdate} variant="secondary" className="flex-grow">Update Event</Button>
                  <Button onClick={handleDelete} variant="secondary" className="flex-grow">Delete Event</Button>
                </div>
              </div>
            )}
          </>
        )
      }
    </div>
  );
};

export default EventDetails;
