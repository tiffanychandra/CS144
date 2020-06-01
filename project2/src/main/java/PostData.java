package ucla.cs144.tm;

import java.util.Date;
import java.sql.*;

public class PostData {

    /* variables for posts per spec */
    public String username;
    public Integer postid;
    public String title;
    public String body;
    public Timestamp created;
    public Timestamp modified;

    public PostData() {
        this.username = null;
        this.postid = null;
        this.title = null;
        this.body = null;
        this.created = null;
        this.modified = null;
    }

    // getter methods for jsp file
    public String getUsername() {
        return this.username;
    }

    public Integer getId() {
        return this.postid;
    }

    public String getTitle() {
        return this.title;
    }

    public String getCreated() {
        // check this
        return this.created.toString().substring(0, 19);
    }

    public String getModified() {
        return this.modified.toString().substring(0, 19);
    }
}