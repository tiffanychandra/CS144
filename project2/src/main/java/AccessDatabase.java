import java.sql.*;
import java.util.*;

import ucla.cs144.tm.PostData;

// database schema from spec 
//Posts(
//     username      VARCHAR(40),
//     postid        INTEGER,
//     title         VARCHAR(100),
//     body          TEXT,
//     modified      TIMESTAMP DEFAULT '2000-01-01 00:00:00',
//     created       TIMESTAMP DEFAULT '2000-01-01 00:00:00',
//     PRIMARY KEY(username, postid)
// )

// TODO: process error handling (currently simply System.out.println)!!!! 

public class AccessDatabase {

    // the Servlet constructor
    public AccessDatabase() {
        c = null;
        s = null;
        ps = null;
        rs = null;
    }

    public void init() {
        /* write any initialization code here or remove this function */

        try {
            Class.forName("com.mysql.jdbc.Driver");
        } catch (ClassNotFoundException ex) {
            System.out.println(ex);
            return;
        }
        try {
            /* create an instance of a Connection object */
            c = DriverManager.getConnection("jdbc:mysql://localhost:3306/CS144", "cs144", "");

        } catch (SQLException ex) {
            System.out.println(ex);
            return;
        }

    }

    public void destroy() {
        /* write any servlet cleanup code here or remove this function */
        try {
            rs.close();
        } catch (Exception e) {
            /* ignored */ }
        try {
            s.close();
        } catch (Exception e) {
            /* ignored */ }
        try {
            c.close();
        } catch (Exception e) {
            /* ignored */ }
    }

    public PostData getPost(String username, int postid) {
        PostData postData = new PostData();
        try {
            // Do stuff
            ps = c.prepareStatement("SELECT * FROM Posts WHERE username = ? AND postid = ?");
            ps.setString(1, username);
            ps.setInt(2, postid);
            rs = ps.executeQuery();

            if (rs.next()) {
                postData.username = rs.getString("username");
                postData.postid = rs.getInt("postid");
                postData.title = rs.getString("title");
                postData.body = rs.getString("body");
                postData.modified = rs.getTimestamp("modified");
                postData.created = rs.getTimestamp("created");
            } else {
                System.out.println("No posts for given username and post id");
            }

        } catch (SQLException ex) {
            // Exception handling stuff
            System.out.println(ex);
        }
        return postData;
    }

    // given username and postID, update post in database
    // if postID <= 0, create a new post
    public void updatePost(String username, int postid, PostData post) {
        Timestamp cur_time = new Timestamp(System.currentTimeMillis() - 25200000); // get current time in PST

        if (postid <= 0) {
            // find last post id to get new post id
            int lastid = 0;
            try {
                ps = c.prepareStatement("SELECT MAX(postid) AS lastid " + "FROM Posts " + "WHERE username = ? ");
                ps.setString(1, username);
                rs = ps.executeQuery();
                if (rs.next())
                    lastid = rs.getInt("lastid");
            } catch (SQLException ex) {
                System.out.println(ex);
            }

            try {
                ps = c.prepareStatement("INSERT INTO Posts Values " + "(?, ?, ?, ?, ?, ?)");
                ps.setString(1, username);
                ps.setInt(2, lastid + 1);
                ps.setString(3, post.title);
                ps.setString(4, post.body);
                ps.setTimestamp(5, cur_time);
                ps.setTimestamp(6, cur_time);

                ps.executeUpdate();

            } catch (SQLException ex) {
                System.out.println(ex);
            }
        }

        else { // if post already exists, update data
            try {
                ps = c.prepareStatement("UPDATE Posts " + "SET title = ?, body = ?, modified = ? "
                        + "WHERE username = ? AND postid = ?");
                ps.setString(1, post.title);
                ps.setString(2, post.body);
                ps.setTimestamp(3, cur_time);
                ps.setString(4, username);
                ps.setInt(5, postid);

                ps.executeUpdate();
            } catch (SQLException ex) {
                System.out.println(ex);
            }
        }
    }

    public void deletePost(String username, int postid) {
        try {
            ps = c.prepareStatement("DELETE FROM Posts WHERE username = ? AND postid = ?");
            ps.setString(1, username);
            ps.setInt(2, postid);
            int n = ps.executeUpdate();
            System.out.println(n + "row deleted");
        } catch (SQLException ex) {
            System.out.println(ex);
        }
    }

    public ArrayList<PostData> getPostList(String username) {
        ArrayList<PostData> postList = new ArrayList<>();
        try {
            ps = c.prepareStatement("SELECT * FROM Posts WHERE username = ? ORDER BY postid");
            ps.setString(1, username);
            rs = ps.executeQuery();
            while (rs.next()) {
                PostData postData = new PostData();
                postData.username = rs.getString("username");
                postData.postid = rs.getInt("postid");
                postData.title = rs.getString("title");
                postData.body = rs.getString("body");
                postData.modified = rs.getTimestamp("modified");
                postData.created = rs.getTimestamp("created");
                postList.add(postData);
            }
        } catch (SQLException ex) {
            System.out.println(ex);
        }
        return postList;
    }

    private Connection c;
    private Statement s;
    private PreparedStatement ps;
    private ResultSet rs;
}