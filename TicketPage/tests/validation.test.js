import test from "node:test";
import assert from "node:assert/strict";

import { parseListQuery, validateAdminPatch, validateCreateTicket } from "../functions/_lib/validation.js";

test("validateCreateTicket accepts minimal valid payload", () => {
  const err = validateCreateTicket({
    type: "movie",
    title: "The Matrix",
    description: "Please add",
    turnstileToken: "token"
  });

  assert.equal(err, null);
});

test("validateCreateTicket rejects invalid type", () => {
  const err = validateCreateTicket({
    type: "book",
    title: "abc",
    turnstileToken: "token"
  });

  assert.equal(err, "Invalid ticket type.");
});

test("parseListQuery enforces max page size", () => {
  const url = new URL("https://example.com/api/tickets?page=2&pageSize=999");
  const parsed = parseListQuery(url);

  assert.equal(parsed.page, 2);
  assert.equal(parsed.pageSize, 50);
});

test("validateAdminPatch checks status", () => {
  const err = validateAdminPatch({ status: "pending" });
  assert.equal(err, "Invalid status.");
});