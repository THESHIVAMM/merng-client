import { useQuery } from "@apollo/react-hooks";
import React, { useContext } from "react";
import { Grid, TransitionGroup } from "semantic-ui-react";

import { AuthContext } from "../context/auth";

import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { FETCH_POSTS_QUERY } from "../util/graphql";

export default function Home() {
  const { user } = useContext(AuthContext);
  const { loading, data: { getPosts: posts } = {} } =
    useQuery(FETCH_POSTS_QUERY);

  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {user && (
          <Grid.Column>
            <PostForm></PostForm>
          </Grid.Column>
        )}
        {loading ? (
          <h1>Loading posts...</h1>
        ) : (
          <TransitionGroup>
            {posts &&
              posts.map((post) => {
                return (
                  <Grid.Column key={post.id}>
                    <PostCard post={post}></PostCard>
                  </Grid.Column>
                );
              })}
          </TransitionGroup>
        )}
      </Grid.Row>
    </Grid>
  );
}
