import PropTypes from 'prop-types';
import Comment from './Comment';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Post = ({ post }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{post.content}</p>
            </CardContent>
            <CardFooter>
                <div className="space-y-2">
                    {post.comments.map(comment => (
                        <Comment key={comment._id} comment={comment} />
                    ))}
                    <Button>Add Comment</Button>
                </div>
            </CardFooter>
        </Card>
    );
};

Post.propTypes = {
    post: PropTypes.object.isRequired,
};

export default Post;
