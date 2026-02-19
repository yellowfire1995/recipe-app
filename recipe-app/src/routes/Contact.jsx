import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { contact } from "../../db/queries";
import logger from "../utils/logger";

export function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const MessageError = () =>
    toast.error(
      "Error submitting message, please try again or email support@cookbookcalc.com.",
    );
  const MessageSuccess = () =>
    toast.success("Message submitted, please wait 24hrs for a response.");

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      return contact(name, email, message);
    },
    onError: (error) => {
      logger.log(error);
      MessageError();
    },
    onSuccess: async () => {
      MessageSuccess();
      setName("");
      setEmail("");
      setMessage("");
    },
  });

  return (
    <Container>
      <title>CookbookCalc | Contact Us</title>

      <Row className="text-center">
        <h2>Contact Us</h2>
      </Row>
      <Row className="justify-content-center">
        <Col md={6}>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              mutate(name, email, message);
            }}
          >
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your name"
                required
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
              />
            </Form.Group>
            <Form.Group controlId="message">
              <Form.Label>Message</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={6}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Enter your message"
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {isPending ? "Sending..." : "Send Message"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
