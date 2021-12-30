import { useMutation } from "@apollo/react-hooks";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import gql from "graphql-tag";
import { useEffect } from "react";
import { Label, Button, Icon, Popup } from "semantic-ui-react";

export default function LikeButton({ user, post: { id, likeCount, likes } }) {
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    if (user && likes.find((like) => like.username === user.usename)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [user, likes]);

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id },
  });
  const likeButton = user ? (
    liked ? (
      <Button color="teal">
        <Icon name="heart" />
      </Button>
    ) : (
      <Button color="teal" basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button basic as={Link} to="/login" color="teal">
      <Icon name="heart" />
    </Button>
  );
  return (
    <Button as="div" labelPosition="right" onClick={likePost}>
      <Popup
        trigger={likeButton}
        content={liked ? "Unlike" : "Like"}
        inverted
      ></Popup>
      <Label basic color="teal" pointing="left">
        {likeCount}
      </Label>
    </Button>
  );
}

const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`;
