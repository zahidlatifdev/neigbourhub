import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import Post from './Post';
import { fetchPosts } from '@/app/features/posts/postsSlice';

const Feed = () => {
    const posts = useSelector(state => state.posts.posts);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);

    return (
        <div className="space-y-4">
            {posts.map(post => (
                <Post key={post.id} post={post} />
            ))}
        </div>
    );
};

export default Feed;
