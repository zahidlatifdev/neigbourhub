import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchPosts, createPost } from '@/app/features/posts/postsSlice';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createComment } from '@/app/features/comments/commentSlice';

const Dashboard = () => {
    const user = useSelector(state => state.auth.user);
    const posts = useSelector(state => state.posts.posts);
    const [newComments, setNewComments] = useState({});

    const dispatch = useDispatch();
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState('');

    useEffect(() => {
        if (user) {
            dispatch(fetchPosts());
        }
    }, [user, dispatch]);

    if (!user) {
        return null;
    }

    const handleCreatePost = () => {
        if (newPostTitle && newPostContent) {
            dispatch(createPost({ title: newPostTitle, content: newPostContent }));
            setNewPostTitle('');
            setNewPostContent('');
        }
    };

    const handleCommentChange = (postId, value) => {
        setNewComments(prev => ({
            ...prev,
            [postId]: value
        }));
    };

    const commentHandler = (postId) => {
        dispatch(createComment({ postId: postId, content: newComments[postId] }));
        setNewComments(prev => ({
            ...prev,
            [postId]: ''
        }));
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}!</h1>
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Create a New Post</CardTitle>
                </CardHeader>
                <CardContent>
                    <Input
                        placeholder="Post Title"
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                        className="mb-4"
                    />
                    <Textarea
                        placeholder="What's on your mind?"
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        className="mb-4"
                    />
                    <Button onClick={handleCreatePost}>Post</Button>
                </CardContent>
            </Card>
            <div className="space-y-6">
                {posts.map(post => (
                    <Card key={post._id}>
                        <CardHeader>
                            <CardTitle>{post.title}</CardTitle>
                            <p className="text-sm text-gray-600">By: {post.author.username}</p>
                        </CardHeader>
                        <CardContent>
                            <p>{post.content}</p>
                        </CardContent>
                        <CardFooter>
                            <div className="w-full">
                                <h4 className="font-semibold mb-2">Comments:</h4>
                                {post.comments && post.comments.map(comment => (
                                    <div key={comment._id} className="mb-2 p-2 bg-gray-100 rounded">
                                        <p className="text-sm text-black">{comment.content}</p>
                                        <p className="text-xs text-gray-500">By: {comment.author.username}</p>
                                    </div>
                                ))}
                                <Input
                                    placeholder="Add a comment"
                                    className="mt-2"
                                    value={newComments[post._id] || ''}
                                    onChange={(e) => handleCommentChange(post._id, e.target.value)}
                                />
                                <Button onClick={() => commentHandler(post._id)} className="mt-2" size="sm">Comment</Button>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
