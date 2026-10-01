import { describe, expect, it } from "vitest";
import { mountSuspended } from "@nuxt/test-utils/runtime";
import TuxCommentThread from "../../app/components/TuxCommentThread.vue";
import { runComponentAxe } from "../axe-helper";

describe("TuxCommentThread Component", () => {
  const sampleAuthors = {
    u1: { id: "u1", name: "Dr. Elena Vance", affiliation: "TTI Safety Division" },
    u2: { id: "u2", name: "Alex Rivera", affiliation: "TTI Connected Infrastructure" },
  };

  const sampleThreads = [
    {
      id: "t1",
      anchor: "Methods §3.2",
      status: "open" as const,
      comments: [
        {
          id: "c1",
          authorId: "u1",
          createdAt: "2026-09-20T10:00:00Z",
          body: "Should we normalize the sensor data by peak volume @Alex?",
        },
      ],
    },
  ];

  it("renders comment thread with anchor, author, and mentions", async () => {
    const wrapper = await mountSuspended(TuxCommentThread, {
      props: {
        modelValue: sampleThreads,
        authors: sampleAuthors,
        currentUser: sampleAuthors.u2,
      },
    });

    expect(wrapper.find(".tux-comment-thread__anchor").text()).toBe("Methods §3.2");
    expect(wrapper.find(".tux-comment__author").text()).toBe("Dr. Elena Vance");
    expect(wrapper.find(".tux-comment__affiliation").text()).toContain("TTI Safety Division");
    expect(wrapper.find(".tux-comment__mention").text()).toBe("@Alex");

    const textarea = wrapper.find("textarea.tux-comment__textarea");
    expect(textarea.exists()).toBe(true);

    const violations = await runComponentAxe(wrapper.element);
    expect(violations).toEqual([]);
  });

  it("supports resolving threads and emits thread:resolve event", async () => {
    const wrapper = await mountSuspended(TuxCommentThread, {
      props: {
        modelValue: sampleThreads,
        authors: sampleAuthors,
        currentUser: sampleAuthors.u2,
      },
    });

    const resolveBtn = wrapper.findAll(".tux-comment-thread__footer button.tux-comment__link")[0];
    expect(resolveBtn.text()).toContain("Resolve");

    await resolveBtn.trigger("click");
    expect(wrapper.emitted("thread:resolve")).toBeTruthy();
    expect(wrapper.emitted("thread:resolve")![0]).toEqual(["t1"]);
  });
});
