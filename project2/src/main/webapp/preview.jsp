<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"%><%@ taglib uri="http://java.sun.com/jsp/jstl/core"
prefix="c" %><!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Preview Post</title>
    <link rel="stylesheet" type="text/css" href="stylesheet.css" />
  </head>
  <body>
    <div>
      <form action="post" method="POST">
        <input
          type="hidden"
          name="username"
          value='<%= request.getParameter("username") %>'
        />
        <input
          type="hidden"
          name="postid"
          value='<%= request.getParameter("postid") %>'
        />
        <input
          type="hidden"
          name="title"
          value='<%= request.getParameter("title") %>'
        />
        <input
          type="hidden"
          name="body"
          value='<%= request.getParameter("body") %>'
        />
        <button type="submit" class="button" name="action" value="open">
          Close
        </button>
      </form>
    </div>
    <div>
      <h1 id="title"><p><%= request.getAttribute("titleHTML") %></p></h1>
      <div id="preview"><p><%= request.getAttribute("bodyHTML") %></p></div>
    </div>
  </body>
</html>
