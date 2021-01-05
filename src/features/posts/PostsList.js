import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { PostAuthor } from './postAuthor'
import { ReactionButtons } from './ReactionButtons'
import { TimeAgo } from './TimeAgo'
//import { selectAllPosts, fetchPosts } from './postsSlice'

import {
  fetchPosts,
  selectPostIds,
  selectPostById,
} from './postsSlice'

export const PostsList = () => {
  //const posts = useSelector(selectAllPosts)
  const orderedPostIds = useSelector(selectPostIds)

  const dispatch = useDispatch()
  const error = useSelector((state) => state.posts.error)

  const postStatus = useSelector((state) => state.posts.status)

  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPosts())
    }
  }, [postStatus, dispatch])

  let content

  if (postStatus === 'loading') {
    content = <div className="loader">Loading...</div>
  } else if (postStatus === 'succeeded') {
    // Sort posts in reverse chronological order by datetime string
    /*const orderedPosts = posts
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))*/

    content = orderedPostIds.map((postId) => (
      <PostExcerpt key={postId} postId={postId} />
    ))
  } else if (postStatus === 'failed') {
    content = <div>{error}</div>
  }

  function PostExcerpt({ postId }) {
    const post = useSelector((state) => selectPostById(state, postId))

    return (
      <article className="post-excerpt" key={post.id}>
        <h3>{post.title}</h3>
        <p className="post-content">{post.content.substring(0, 100)}</p>
        <PostAuthor userId={post.user} />
        <ReactionButtons post={post} />

        <TimeAgo />
        <Link to={`/posts/${post.id}`} className="button muted-button">
          View Post
        </Link>
      </article>
    )
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  )
}
