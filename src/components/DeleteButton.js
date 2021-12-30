import React from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { Icon, Confirm, Button, Popup } from "semantic-ui-react";
import { useState } from "react";
import { FETCH_POSTS_QUERY } from "../util/graphql";

export default function DeleteButton({ postId, commentId, callback }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;
  const [deletePostOrMutation] = useMutation(mutation, {
    update(proxy) {
      setConfirmOpen(false);
      if (!commentId) {
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY,
        });
        let newData = data.getPosts.filter((post) => post.id !== postId);
        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: {
            ...data,
            getPosts: {
              newData,
            },
          },
        });
      }
      if (callback) callback();
    },
    variables: {
      postId,
      commentId,
    },
  });
  return (
    <>
      <Popup
        content={commentId ? "Delete comment" : "Delete post"}
        inverted
        trigger={
          <Button
            as="div"
            color="red"
            floated="right"
            onClick={() => setConfirmOpen(true)}
          >
            <Icon name="trash" style={{ margin: 0 }}></Icon>
          </Button>
        }
      ></Popup>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrMutation}
      />
    </>
  );
}

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`;
const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;
