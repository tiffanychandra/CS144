<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%><%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %><!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Edit Post</title>
    <link rel="stylesheet" type="text/css" href="stylesheet.css">
</head>
<body>
    <div><h1>Edit Post</h1></div>
    <form action="post" method="POST">
        <div>
            <button type="submit" class="button" name="action" value="save">Save</button>
            <button type="submit" class="button" name="action" value="list">Close</button>
            <button type="submit" class="button" name="action" value="preview">Preview</button>
            <button type="submit" class="button" name="action" value="delete">Delete</button>
        </div>
        <input type="hidden" name="username" value='<%= request.getParameter("username") %>'>
        <input type="hidden" name="postid" value='<%= request.getParameter("postid") %>'>
        <div>
            <p>
            <h2><label for="title">Title</label></h2>
            <input type="text" id="title" name="title" value='<%= request.getAttribute("title") %>'>
        </p>
        </div>
        <div>
            <p>
            <h2> <label for="body">Body</label></h2></div>
            <textarea style="height: 15rem; width: 30rem" id="body" name="body"><%= request.getAttribute("body") %></textarea>
        </p>
        </div>
    </form>
</body>
</html>
