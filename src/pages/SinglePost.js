import React from "react";
import { useContext } from "react";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";
import {
  Button,
  Image,
  Label,
  Icon,
  Form,
  Card,
  Popup,
  Grid,
  CardContent,
} from "semantic-ui-react";
import moment from "moment";
import { AuthContext } from "../context/auth";
import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";
import { useState } from "react";
import { useRef } from "react";

export default function SinglePost(props) {
  const postId = props.match.params.postId;
  const [comment, setComment] = useState("");
  const { user } = useContext(AuthContext);
  const commentInputRef = useRef(null);

  const { data: { getPost } = {} } = useQuery(FETCH_POSTS_QUERY, {
    variables: {
      postId,
    },
  });
  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment("");
      commentInputRef.current.blur();
    },
    variables: { postId, body: comment },
  });

  function deletePostCallback() {
    props.history.push("/");
  }
  let postMarkup;
  if (!getPost) {
    postMarkup = <p>Loading post...</p>;
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount,
    } = getPost;

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width={2}>
            <Image
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
              size="small"
              float="right"
            ></Image>
          </Grid.Column>
          <Grid.Column width={10}>
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likeCount, likes }} />
                <Popup
                  content="Comment on post"
                  inverted
                  trigger={
                    <Button
                      as="div"
                      labelposition="right"
                      onClick={() => console.log("Comment on Post")}
                    >
                      <Button basic color="blue">
                        <Icon name="comments" />
                      </Button>
                      <Label basic color="blue" pointing="left">
                        {commentCount}
                      </Label>
                    </Button>
                  }
                ></Popup>
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid>
                <CardContent>
                  <p>Post a Comment</p>
                  <Form>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment.."
                        name="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        ref={commentInputRef}
                      />
                      <Button
                        className="ui button teal"
                        type="submit"
                        disabled={comment.trim() === ""}
                        onClick={submitComment}
                      >
                        Submit
                      </Button>
                    </div>
                  </Form>
                </CardContent>
              </Card>
            )}
            {comments.map((comment) => {
              return (
                <Card fluid key={comment.id}>
                  <CardContent>
                    {user && user.username === comment.username && (
                      <DeleteButton postId={id} commentId={comment.id} />
                    )}
                    <Card.Header>{comment.username}</Card.Header>
                    <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                    <Card.Description>{comment.body}</Card.Description>
                  </CardContent>
                </Card>
              );
            })}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
  return postMarkup;
}

const SUBMIT_COMMENT_MUTATION = gql`
  mutation ($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

const FETCH_POSTS_QUERY = gql`
  query ($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;
