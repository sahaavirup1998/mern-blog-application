import { useState } from "react";
import { Alert, Button, Textarea } from "flowbite-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function CommentSection({postId}) {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState("");
  const [commentError, setCommentError] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comments.length > 300) {
      return;
    }
    try {
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comments,
          postId,
          userId: currentUser._id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setComments("");
        setCommentError(null)
      }
    } catch (error) {
        setCommentError(error.message);
    }
  };
  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {currentUser ? (
        <div className="flex items-center gap-1 text-gray-600 text-sm">
          <p>Signed in as: </p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentUser.profilePicture}
            alt=""
          />
          <Link
            to={"/dashboard?tab=profile"}
            className="text-md text-cyan-600 hover:underline font-medium"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be login to comment.
          <Link to={"./signin"} className="text-red-500 hover:underline">
            Sign In
          </Link>
        </div>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="border border-teal-500 rounded-md p-3 mt-5"
        >
          <Textarea
            placeholder="Add a comment..."
            rows="5"
            maxLength="300"
            onChange={(e) => setComments(e.target.value)}
            value={comments}
          />
          <div className="flex justify-between mt-5 items-center">
            <p className="text-gray-500 text-sm">
              {300 - comments.length} characters remaining
            </p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
          {
            commentError && (
              <Alert color="failure" className="mt-5">{commentError}</Alert>
            )
          }
        </form>
      )}
    </div>
  );
}
