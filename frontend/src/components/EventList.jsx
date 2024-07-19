import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserEvents, deleteEvent, updateEvent } from "@/app/features/events/eventSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

const UserEvents = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const events = useSelector((state) => state.events.userEvents);

    useEffect(() => {
        if (user) {
            dispatch(fetchUserEvents(user.id));
        }
    }, [user, dispatch]);

    const handleDelete = (eventId) => {
        dispatch(deleteEvent(eventId));
    };

    const handleUpdate = (eventId) => {
        // Implement event update logic, e.g., open a modal or navigate to an update page
    };

    const handleAddAttendee = (eventId, email) => {
        // Implement logic to add attendee by email
    };

    const handleRemoveAttendee = (eventId, email) => {
        // Implement logic to remove attendee by email
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Your Events</h1>
            <div className="space-y-6">
                {events.map((event) => (
                    <div key={event._id} className="border rounded-lg p-4 mb-4">
                        <h2 className="text-2xl font-semibold">{event.title}</h2>
                        <p className="text-gray-700">Date: {format(new Date(event.date), "MMMM d, yyyy 'at' h:mm a")}</p>
                        <div className="mt-4">
                            <Button onClick={() => handleUpdate(event._id)} className="mr-2">
                                Update
                            </Button>
                            <Button onClick={() => handleDelete(event._id)} variant="outline" className="mr-2">
                                Delete
                            </Button>
                            <Input
                                type="email"
                                placeholder="Add attendee by email"
                                onBlur={(e) => handleAddAttendee(event._id, e.target.value)}
                                className="mt-2"
                            />
                            <Button
                                onClick={(e) => handleRemoveAttendee(event._id, e.target.previousSibling.value)}
                                variant="outline"
                                className="mt-2"
                            >
                                Remove Attendee
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserEvents;
