import PropTypes from 'prop-types';
import Comment from './Comment';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Post = ({ post }) => {
    return (
        <Card className="border border-gray-300 shadow-lg">
            <CardHeader className="bg-blue-50 p-4">
                <CardTitle className="text-xl font-bold text-blue-700">{post.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
                <p className="text-gray-800">{post.content}</p>
            </CardContent>
            <CardFooter className="p-4 bg-blue-50">
                <div className="space-y-2">
                    {post.comments.map(comment => (
                        <Comment key={comment._id} comment={comment} />
                    ))}
                    <Button className="mt-4" variant="primary">Add Comment</Button>
                </div>
            </CardFooter>
        </Card>
    );
};

Post.propTypes = {
    post: PropTypes.object.isRequired,
};

export default Post;
