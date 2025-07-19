import React from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import { EditorContent } from "@tiptap/react";
import FormatBold from "@mui/icons-material/FormatBold";
import FormatItalic from "@mui/icons-material/FormatItalic";
import FormatUnderlined from "@mui/icons-material/FormatUnderlined";
import FormatListBulleted from "@mui/icons-material/FormatListBulleted";
import FormatListNumbered from "@mui/icons-material/FormatListNumbered";
import InsertPhoto from "@mui/icons-material/InsertPhoto";
import TableChart from "@mui/icons-material/TableChart";
import YouTube from "@mui/icons-material/YouTube";

const ChatSection = ({
  messages,
  newMessage,
  editor,
  colors,
  isMobile,
  safeExperienceData,
  handleSendMessage,
  addImage,
  addTable,
  addYoutubeVideo,
  cmname
}) => (
  <Box
    sx={{
      p: 2,
      backgroundColor: "#f5f5f5",
      borderRadius: "8px",
      display: "flex",
      flexDirection: "column",
      minHeight: isMobile ? "550px" : "",
      maxHeight: isMobile ? "600px" : "620px",
    }}
  >
    <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
      Discussions
    </Typography>
    <Typography sx={{ mb: 2, color: colors.grey[600] }}>
      Discuss with Customer Support
    </Typography>
    {/* Messages Display */}
    <Box
      sx={{
        flex: 1,
        backgroundColor: "white",
        borderRadius: "4px",
        p: 2,
        mb: 2,
        border: "1px solid #ddd",
        overflowY: "auto",
        minHeight: "200px",
        maxHeight: "800px",
      }}
    >
      {messages.map((message, index) => (
        <Box
          key={index}
          sx={{
            mb: 2,
            display: "flex",
            justifyContent:
              message.sender === "manager" ? "flex-start" : "flex-end",
          }}
        >
          <Box>
            {message.sender === "manager" ? (
              <Typography
                variant="caption"
                sx={{
                  color: colors.grey[700],
                  fontWeight: "bold",
                  mb: 0.5,
                  display: "block",
                  textAlign: "left",
                }}
              >
                {message.crmname}
              </Typography>
            ) : (
              <Typography
                variant="caption"
                sx={{
                  color: colors.grey[700],
                  fontWeight: "bold",
                  mb: 0.5,
                  display: "block",
                  textAlign: "left",
                }}
              >
                {cmname}
              </Typography>
            )}
            <Box
              sx={{
                p: 1.5,
                borderRadius: 1,
                bgcolor:
                  message.sender === "manager"
                    ? colors.blueAccent[100]
                    : "#f0f0f0",
                display: "inline-block",
                minWidth: 80,
                maxWidth: 350,
                textAlign: "left",
              }}
              dangerouslySetInnerHTML={{ __html: message.text }}
            />
            {message.time && (
              <Typography
                variant="caption"
                sx={{
                  color: "#aaa",
                  display: "block",
                  mt: 0.5,
                  textAlign:
                    message.sender === "manager" ? "left" : "right",
                }}
              >
                {message.time}
              </Typography>
            )}
          </Box>
        </Box>
      ))}
    </Box>
    {/* Tiptap Editor */}
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: "4px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Toolbar */}
      {editor && (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            p: 1,
            borderBottom: `1px solid ${colors.grey[300]}`,
            flexWrap: "wrap",
          }}
        >
          <IconButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            color={editor.isActive("bold") ? "primary" : "default"}
            size="small"
          >
            <FormatBold fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            color={editor.isActive("italic") ? "primary" : "default"}
            size="small"
          >
            <FormatItalic fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            color={editor.isActive("underline") ? "primary" : "default"}
            size="small"
          >
            <FormatUnderlined fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            color={editor.isActive("bulletList") ? "primary" : "default"}
            size="small"
          >
            <FormatListBulleted fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            color={editor.isActive("orderedList") ? "primary" : "default"}
            size="small"
          >
            <FormatListNumbered fontSize="small" />
          </IconButton>
          <IconButton onClick={addImage} size="small">
            <InsertPhoto fontSize="small" />
          </IconButton>
          <IconButton onClick={addTable} size="small">
            <TableChart fontSize="small" />
          </IconButton>
          <IconButton onClick={addYoutubeVideo} size="small">
            <YouTube fontSize="small" />
          </IconButton>
        </Box>
      )}
      {/* Editor Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          overflow: "scroll",
          height: "250px",
        }}
      >
        <Box
          sx={{
            flex: 1,
            p: 2,
            minHeight: "100px",
            maxHeight: "100px",
            "& .tiptap": {
              minHeight: "200px",
              outline: "none",
              "& p": {
                margin: 0,
                marginBottom: "0.5em",
              },
            },
          }}
        >
          <EditorContent editor={editor} />
        </Box>
      </Box>
    </Box>
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        maxHeight: "100px",
        width: "100%",
        mt: 1,
      }}
    >
      <Button
        variant="contained"
        onClick={handleSendMessage}
        disabled={!newMessage.trim()}
        fullWidth
        className="form-button"
        sx={{
          background: colors.blueAccent[1000],
          color: "#fff",
          "&:hover": { backgroundColor: colors.blueAccent[600] },
          textTransform: "none",
          minWidth: 0,
          width: "100%",
          display: safeExperienceData.status === "Resolved" ? "none" : "block",
        }}
      >
        Send
      </Button>
    </Box>
  </Box>
);

export default ChatSection; 