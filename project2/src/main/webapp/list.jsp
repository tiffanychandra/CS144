<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%><%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %><!DOCTYPE html>
<%@ page import="java.util.ArrayList, ucla.cs144.tm.PostData" %>

<html>
<head>
    <meta charset="UTF-8">
    <title>List Post</title>
    <link rel="stylesheet" type="text/css" href="stylesheet.css">
</head>
<body>
    <div><h1>List Page</h1>
    	<div>
    		<form action="post" type="button" method="POST" id="0">
            <input type="hidden" name="username" value='<%= request.getParameter("username") %>'>
            <input type="hidden" name="postid" value="0">
            <button type="submit" class="button" name="action" value="open">New Post</button>
        	</form>
        </div>
        <div>
            <table align="center|center|center|center">
            <tr>
                <th>Title</th>
                <th>Created</th>
                <th>Modified</th>
                <th></th>
            </tr>
            <% ArrayList<PostData> postList = (ArrayList<PostData>)request.getAttribute("postList"); %>
                <c:forEach items="${postList}" var="curpost">
                    <tr>
                        <form action="post" method="POST">
                            <td id="title"><c:out value="${curpost.getTitle()}" /></td>
                            <td><c:out value="${curpost.getCreated()}" /></td>
                            <td><c:out value="${curpost.getModified()}" /></td>
                            <input type="hidden" name="username" value="<c:out value="${curpost.getUsername()}"/>" />
                            <input type="hidden" name="postid" value="<c:out value="${curpost.getId()}"/>" />
                            <td>
                                <button type="submit" class="button" name="action" value="open">Open</button>
                                <button type="submit" class="button" name="action" value="delete">Delete</button>
                            </td>
                        </form>
                    </tr>

                </c:forEach>
            </table>
        </div>
</body>
</html>

