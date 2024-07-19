import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { fetchEvents, createEvent } from "@/app/features/events/eventSlice"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users } from "lucide-react"
import { format } from "date-fns"
import { useNavigate } from "react-router-dom";

function Events() {
  const events = useSelector(state => state.events.events)
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
  })

  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    dispatch(fetchEvents())
  }, [dispatch, events])

  const addToCalendar = (event) => {
    const startDate = new Date(event.date);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

    const title = encodeURIComponent(event.title);
    const description = encodeURIComponent(event.description);
    const location = encodeURIComponent(event.location);

    const formatDateForGoogleCalendar = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const startDateString = formatDateForGoogleCalendar(startDate);
    const endDateString = formatDateForGoogleCalendar(endDate);

    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDateString}/${endDateString}&details=${description}&location=${location}&sf=true&output=xml`;

    window.open(googleCalendarUrl, '_blank');
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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(createEvent(newEvent))
    setNewEvent({
      title: '',
      description: '',
      date: '',
      location: '',
    })
    setShowForm(false)
  }

  const handleCardClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>
      <div className="mb-8">
        <Button onClick={() => setShowForm(!showForm)} variant="secondary">
          {showForm ? 'Cancel' : 'Create New Event'}
        </Button>
        {showForm && (
          <form onSubmit={handleSubmit} className="mt-4 p-4 border border-gray-300 rounded bg-white shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Create Event</h2>
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
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <Card key={event._id} className="overflow-hidden cursor-pointer" onClick={() => handleCardClick(event._id)}>
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <CardTitle>{event.title}</CardTitle>
              <CardDescription className="text-gray-100">
                {format(new Date(event.date), "MMMM d, yyyy")}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-gray-600 mb-4">{event.description}</p>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <MapPin className="w-4 h-4 mr-2" />
                {event.location}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Users className="w-4 h-4 mr-2" />
                {event.attendees.length} attendees
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Hosted by {event.author.username}
              </div>
              <Button variant="outline" onClick={() => addToCalendar(event)}>
                <Calendar className="w-4 h-4 mr-2" />
                Add to Calendar
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Events