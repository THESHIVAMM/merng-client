import React from "react";
import { Card, Image, Button, Icon, Label, Popup } from "semantic-ui-react";
import moment from "moment";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";
import { useContext } from "react";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";
export default function PostCard({
  post: { body, createdAt, id, username, likeCount, commentCount, likes },
}) {
  const { user } = useContext(AuthContext);
  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/molly.png"
        />
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).fromNow(true)}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton user={user} post={{ id, likes, likeCount }} />
        <Popup
          content="Comment on Post"
          inverted
          trigger={
            <Button labelposition="right" as={Link} to={`/posts/${id}`}>
              <Button color="blue" basic>
                <Icon name="comments" />
              </Button>
              <Label basic color="blue" pointing="left">
                {commentCount}
              </Label>
            </Button>
          }
        ></Popup>

        {user && user.username === username && <DeleteButton postId={id} />}
      </Card.Content>
    </Card>
  );
}
