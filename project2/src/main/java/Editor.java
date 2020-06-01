import java.io.IOException;
import java.sql.*;
import java.util.List;
import java.util.ArrayList;
import java.util.Date;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.servlet.Servlet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.sql.DataSource;

import org.commonmark.node.*;
import org.commonmark.parser.Parser;
import org.commonmark.renderer.html.HtmlRenderer;

import ucla.cs144.tm.PostData;

/**
 * Servlet implementation class for Servlet: ConfigurationTest
 *
 */

// TO DO: error handling

public class Editor extends HttpServlet {

	/**
	 * The Servlet constructor
	 * 
	 * @see javax.servlet.http.HttpServlet#HttpServlet()
	 */
	public Editor() {

	}

	public void init() throws ServletException {
		/* write any servlet initialization code here or remove this function */
	}

	public void destroy() {
		/* write any servlet cleanup code here or remove this function */
	}

	/**
	 * Handles HTTP GET requests
	 * 
	 * @see javax.servlet.http.HttpServlet#doGet(HttpServletRequest request,
	 *      HttpServletResponse response)
	 */
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// implement your GET method handling code here

		String action = request.getParameter("action");
		// application parameters
		String username = request.getParameter("username");
		String postid = request.getParameter("postid");
		String title = request.getParameter("title");
		String body = request.getParameter("body");

		// 5 different actions, handle open, preview, and list only
		if (action == null) {
			request.setAttribute("error", "400: Action parameter cannot be empty");
			request.getRequestDispatcher("/error.jsp").forward(request, response);
			response.setStatus(400);
			return;
		}
		switch (action) {
			case "open": {
				if (username == null || postid == null) {
					request.setAttribute("error", "400: Invalid parameters");
					response.setStatus(400);
					request.getRequestDispatcher("/error.jsp").forward(request, response);
					return;
				}
				try {
					Integer.parseInt(postid);
				} catch (NumberFormatException ex) {
					request.setAttribute("error", "400: Invalid parameters");
					request.getRequestDispatcher("/error.jsp").forward(request, response);
					response.setStatus(400);
					return;
				}
				handleOpen(request, response);
				break;
			}
			case "save": {
				request.setAttribute("error", "400: Action save cannot be issued using HTTP GET method");
				request.getRequestDispatcher("/error.jsp").forward(request, response);
				response.setStatus(400);
				break;
			}
			case "delete": {
				request.setAttribute("error", "400: Action delete cannot be issued using HTTP GET method");
				response.setStatus(400);
				request.getRequestDispatcher("/error.jsp").forward(request, response);
				break;
			}
			case "preview": {
				if (username == null || postid == null || title == null || body == null) {
					request.setAttribute("error", "400: Invalid parameters");
					request.getRequestDispatcher("/error.jsp").forward(request, response);
					response.setStatus(400);
					return;
				}
				try {
					Integer.parseInt(postid);
				} catch (NumberFormatException ex) {
					request.setAttribute("error", "400: Invalid parameters");
					response.setStatus(400);
					request.getRequestDispatcher("/error.jsp").forward(request, response);
					return;
				}
				handlePreview(request, response);
				break;
			}
			case "list": {
				if (username == null) {
					request.setAttribute("error", "400: Invalid parameters");
					response.setStatus(400);
					request.getRequestDispatcher("/error.jsp").forward(request, response);
					return;
				}
				handleList(request, response);
				break;
			}
			default: {
				request.setAttribute("error", "400: Invalid parameters");
				response.setStatus(400);
				request.getRequestDispatcher("/error.jsp").forward(request, response);
			}
		}

	}

	/**
	 * Handles HTTP POST requests
	 * 
	 * @see javax.servlet.http.HttpServlet#doPost(HttpServletRequest request,
	 *      HttpServletResponse response)
	 */
	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// implement your POST method handling code here
		String action = request.getParameter("action");
		// application parameters
		String username = request.getParameter("username");
		String postid = request.getParameter("postid");
		String title = request.getParameter("title");
		String body = request.getParameter("body");

		System.out.println(action);

		// 5 different actions
		if (action == null) {
			request.setAttribute("error", "400: Action parameter cannot be empty");
			response.setStatus(400);
			request.getRequestDispatcher("/error.jsp").forward(request, response);
			return;
		}
		switch (action) {
			case "open": {
				if (username == null || postid == null) {
					request.setAttribute("error", "400: Invalid parameters");
					response.setStatus(400);
					request.getRequestDispatcher("/error.jsp").forward(request, response);
					return;
				}
				try {
					Integer.parseInt(postid);
				} catch (NumberFormatException ex) {
					request.setAttribute("error", "400: Invalid parameters");
					response.setStatus(400);
					request.getRequestDispatcher("/error.jsp").forward(request, response);
					return;
				}
				handleOpen(request, response);
				break;
			}
			case "save": {
				if (username == null || postid == null || title == null || body == null) {
					request.setAttribute("error", "400: Invalid parameters");
					response.setStatus(400);
					request.getRequestDispatcher("/error.jsp").forward(request, response);
					return;
				}
				handleSave(request, response);
				break;
			}
			case "delete": {
				if (username == null || postid == null) {
					request.setAttribute("error", "400: Invalid parameters");
					response.setStatus(400);
					request.getRequestDispatcher("/error.jsp").forward(request, response);
					return;
				}
				handleDelete(request, response);
				break;
			}
			case "preview": {
				if (username == null || postid == null || title == null || body == null) {
					request.setAttribute("error", "400: Invalid parameters");
					response.setStatus(400);
					request.getRequestDispatcher("/error.jsp").forward(request, response);
					return;
				}
				try {
					Integer.parseInt(postid);
				} catch (NumberFormatException ex) {
					request.setAttribute("error", "400: Invalid parameters");
					response.setStatus(400);
					request.getRequestDispatcher("/error.jsp").forward(request, response);
					return;
				}
				handlePreview(request, response);
				break;
			}
			case "list": {
				if (username == null) {
					request.setAttribute("error", "400: Invalid parameters");
					response.setStatus(400);
					request.getRequestDispatcher("/error.jsp").forward(request, response);
					return;
				}
				handleList(request, response);
				break;
			}
			default: {
				request.setAttribute("error", "400: Invalid parameters");
				response.setStatus(400);
				request.getRequestDispatcher("/error.jsp").forward(request, response);
			}
		}
	}

	// function: return "edit page" for the post with the given postid by the user
	// if postid=0, create post is clicked, return "edit page" with empty title and
	// body
	private void handleOpen(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		String username = request.getParameter("username");
		String postid = request.getParameter("postid");
		int post = Integer.valueOf(postid);
		String title = request.getParameter("title");
		String body = request.getParameter("body");

		AccessDatabase db = new AccessDatabase();
		db.init();
		PostData postData = db.getPost(username, post);

		if (post <= 0) {
			// if title and body parameters have been passed, use the passed parameter
			// values as the initial title and body values and return with status code 200
			// (OK)
			// otherwise, set missing title and/or body to empty string and return with
			// status code 200 (OK)
			request.setAttribute("title", title != null ? title : "");
			request.setAttribute("body", body != null ? body : "");
			response.setStatus(200);
		}

		else if (postData.username == null) { // (username, postid) row not found
			db.destroy();
			request.setAttribute("error", "404 Not found");
			response.setStatus(404);
			request.getRequestDispatcher("/error.jsp").forward(request, response);
			return;
		} else { // if postData.postid > 0
					// if title and body parameters have been passed, use the passed parameter
					// values as the initial title and body values and return with status code 200
					// (OK)
					// otherwise
					// if (username, postid) row exists in the database, retrieve the title and body
					// from the database and return with status code 200 (OK).
					// otherwise, return with status code 404 (Not found).
			if (title == null && body == null) {
				request.setAttribute("title", postData.title != null ? postData.title : "");
				request.setAttribute("body", postData.body != null ? postData.body : "");
			} else {
				request.setAttribute("title", title != null ? title : "");
				request.setAttribute("body", body != null ? body : "");
			}
			response.setStatus(200);
		}
		db.destroy();
		request.getRequestDispatcher("/edit.jsp").forward(request, response);
	}

	// function: save the post into the db and go to the "list page" for the user
	private void handleSave(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String username = request.getParameter("username");
		String postid = request.getParameter("postid");
		int post = Integer.valueOf(postid);
		String title = request.getParameter("title");
		String body = request.getParameter("body");

		AccessDatabase db = new AccessDatabase();
		db.init();
		PostData postData = new PostData();
		postData.title = title;
		postData.body = body;
		db.updatePost(username, post, postData);
		db.destroy();
		handleList(request, response);
	}

	// function: delete the correseponding post and go to the "list page"
	private void handleDelete(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		AccessDatabase db = new AccessDatabase();
		db.init();
		String username = request.getParameter("username");
		String postid = request.getParameter("postid");
		int post = Integer.valueOf(postid);

		db.deletePost(username, post);
		db.destroy();
		handleList(request, response);

	}

	// function: return the "preview page" with the html rendering of the given
	// title and body
	private void handlePreview(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		AccessDatabase db = new AccessDatabase();
		db.init();
		String username = request.getParameter("username");
		String postid = request.getParameter("postid");
		int post = Integer.valueOf(postid);
		String title = request.getParameter("title");
		String body = request.getParameter("body");

		// html rendering of title and body
		Parser parser = Parser.builder().build();
		HtmlRenderer renderer = HtmlRenderer.builder().build();
		String titleHTML = renderer.render(parser.parse(title));
		String bodyHTML = renderer.render(parser.parse(body));
		request.setAttribute("titleHTML", titleHTML);
		request.setAttribute("bodyHTML", bodyHTML);

		request.getRequestDispatcher("/preview.jsp").forward(request, response);
	}

	// function: return the "list page" for the user
	private void handleList(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		AccessDatabase db = new AccessDatabase();
		db.init();
		String username = request.getParameter("username");
		ArrayList<PostData> postList = db.getPostList(username);
		request.setAttribute("postList", postList);
		db.destroy();

		request.getRequestDispatcher("/list.jsp").forward(request, response);

	}
}
