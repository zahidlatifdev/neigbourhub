import PropTypes from "prop-types";
const Comment = ({ comment }) => {
    return (
        <div key={comment._id} className="bg-gray-500 p-2 rounded">
            <p className="text-sm">{comment.content}</p>
            <p className="text-xs text-gray-200">By: {comment.author.username}</p>
        </div>
    );
};

Comment.propTypes = {
    comment: PropTypes.object.isRequired,
}

export default Comment;
