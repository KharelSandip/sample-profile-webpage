from flask import Flask, jsonify, request, session, redirect, send_from_directory, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import check_password_hash
from sqlalchemy import text
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
from werkzeug.middleware.proxy_fix import ProxyFix

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ENV_PATH = os.path.join(BASE_DIR, ".env")
FRONTEND_PATH = os.path.join(BASE_DIR,  "frontend")
FRONTEND_DIR = os.path.abspath(FRONTEND_PATH)
load_dotenv(ENV_PATH)

app = Flask(__name__, template_folder="frontend")

app.wsgi_app = ProxyFix(
    app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_port=1, x_prefix=1
)

app.secret_key = os.getenv("SECRET_KEY")
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME")
ADMIN_PASSWORD_HASH = os.getenv("ADMIN_PASSWORD_HASH")
ADMIN_ROUTE = os.getenv("ADMIN_ROUTE")
LOGIN_ROUTE=os.getenv("LOGIN_ROUTE")

app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE='Lax', 
    SESSION_COOKIE_SECURE=False,   
    PERMANENT_SESSION_LIFETIME=timedelta(minutes=15),
    SESSION_COOKIE_PATH='/',       
)

CORS(app, supports_credentials=True)

# Docker MySQL connection
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://admin_user:password@portfolio_mysql:3306/mysql_db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)


def parse_date(date_string):
    if not date_string:
        return None
    try:
        return datetime.strptime(date_string, "%Y-%m-%d").date()
    except (ValueError, TypeError):
        return None




class Skill(db.Model):
    __tablename__ = "skills"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(100))
    level = db.Column(db.String(50))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "category": self.category,
            "level": self.level,
        }


class Project(db.Model):
    __tablename__ = "projects"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    problem = db.Column(db.Text)
    action = db.Column(db.Text)
    result = db.Column(db.Text)
    github_url = db.Column(db.String(255))
    linkedin_url = db.Column(db.String(255))

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "problem": self.problem,
            "action": self.action,
            "result": self.result,
            "github_url": self.github_url,
            "linkedin_url": self.linkedin_url,
        }


class Certification(db.Model):
    __tablename__ = "certifications"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    issuer = db.Column(db.String(150))
    issue_date = db.Column(db.Date)
    credential_url = db.Column(db.String(255))

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "issuer": self.issuer,
            "issue_date": self.issue_date.isoformat() if self.issue_date else None,
            "credential_url": self.credential_url,
        }


class Education(db.Model):
    __tablename__ = "education"

    id = db.Column(db.Integer, primary_key=True)
    school_name = db.Column(db.String(150), nullable=False)
    degree = db.Column(db.String(150))
    grade = db.Column(db.String(50))
    field_of_study = db.Column(db.String(150))
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)

    def to_dict(self):
        return {
            "id": self.id,
            "school_name": self.school_name,
            "degree": self.degree,
            "grade" : self.grade,
            "field_of_study": self.field_of_study,
            "start_date": self.start_date.isoformat() if self.start_date else None,
            "end_date": self.end_date.isoformat() if self.end_date else None,
        }


class Feedback(db.Model):
    __tablename__ = "feedback"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    role_or_linkedin = db.Column(db.String(255), nullable=True)
    comment = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_read = db.Column(db.Boolean, default=False, nullable=False)
    is_hidden = db.Column(db.Boolean, default=False, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "role_or_linkedin": self.role_or_linkedin,
            "comment": self.comment,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "is_read": self.is_read,
            "is_hidden": self.is_hidden,
        }


class WorkingOn(db.Model):
    __tablename__ = "working_on"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    github_url = db.Column(db.String(500), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "github_url": self.github_url,
        }


class FeaturedProject(db.Model):
    __tablename__ = "featured_projects"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    github_url = db.Column(db.String(500), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "github_url": self.github_url,
        }


class WhyWorkWithMe(db.Model):
    __tablename__ = "why_work_with_me"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
        }
    

# Login Page Post 

@app.route("/api/admin/login", methods=["POST"])
def admin_login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    
    if username == ADMIN_USERNAME and check_password_hash(ADMIN_PASSWORD_HASH, password):
        session["is_admin"] = True 
        session.permanent = True  
        return jsonify({
            "success": True, 
            "redirect": ADMIN_ROUTE
        }), 200

    return jsonify({"success": False, "error": "Invalid credentials"}), 401


# Check the Session 
@app.route(ADMIN_ROUTE)
def admin_page():
    if not session.get("is_admin"):
        return redirect("/")
    return render_template("admin.html")


# Session API Check
@app.route("/api/admin/check", methods=["GET"])
def admin_check():
    if session.get("is_admin"):
        return jsonify({"logged_in": True})
    return jsonify({"logged_in": False}), 401

# Logout API
@app.route("/api/admin/logout", methods=["POST"])
def admin_logout():
    session.pop("is_admin", None)
    return jsonify({"success": True})

# Health / Home

@app.route("/")
def home():
    return jsonify({"message": "Backend running"})


@app.route("/health")
def health():
    try:
        db.session.execute(text("SELECT 1"))
        return jsonify({"status": "healthy", "database": "connected"})
    except Exception as e:
        return jsonify({"status": "unhealthy", "error": str(e)}), 500


# Resume Page API



@app.route("/api/site-data", methods=["GET"])
def site_data():
    return jsonify({
        "skills": [skill.to_dict() for skill in Skill.query.order_by(Skill.id.asc()).all()],
        "projects": [project.to_dict() for project in Project.query.order_by(Project.id.asc()).all()],
        "certifications": [cert.to_dict() for cert in Certification.query.order_by(Certification.id.asc()).all()],
        "education": [edu.to_dict() for edu in Education.query.order_by(Education.id.asc()).all()],
        "working_on": [work.to_dict() for work in WorkingOn.query.order_by(WorkingOn.id.asc()).all()],
        "featured_projects": [project.to_dict() for project in FeaturedProject.query.order_by(FeaturedProject.id.asc()).all()],
        "why_work_with_me": [item.to_dict() for item in WhyWorkWithMe.query.order_by(WhyWorkWithMe.id.asc()).all()],
    })



# Skills

@app.route("/api/skills", methods=["GET"])
def get_skills():
    skills = Skill.query.order_by(Skill.id.asc()).all()
    return jsonify([skill.to_dict() for skill in skills])


@app.route("/api/skills", methods=["POST"])
def add_skill():
    if not session.get("is_admin"):
        return jsonify({"message": "Login required"}), 401
    data = request.get_json() or {}

    name = (data.get("name") or "").strip()
    category = (data.get("category") or "").strip()
    level = (data.get("level") or "").strip()

    if not name:
        return jsonify({"message": "Skill name is required"}), 400

    skill = Skill(name=name, category=category, level=level)
    db.session.add(skill)
    db.session.commit()

    return jsonify({
        "message": "Skill added successfully",
        "skill": skill.to_dict()
    }), 201


@app.route("/api/skills/<int:skill_id>", methods=["PUT"])
def update_skill(skill_id):
    if not session.get("is_admin"):
        return jsonify({"message": "Login required"}), 401
    skill = Skill.query.get_or_404(skill_id)
    data = request.get_json() or {}

    if data.get("name") is not None:
        skill.name = (data.get("name") or "").strip()
    if data.get("category") is not None:
        skill.category = (data.get("category") or "").strip()
    if data.get("level") is not None:
        skill.level = (data.get("level") or "").strip()

    if not skill.name:
        return jsonify({"message": "Skill name is required"}), 400

    db.session.commit()

    return jsonify({
        "message": "Skill updated successfully",
        "skill": skill.to_dict()
    })


@app.route("/api/skills/<int:skill_id>", methods=["DELETE"])
def delete_skill(skill_id):
    if not session.get("is_admin"):
        return jsonify({"error": "Unauthorized"}), 401
    skill = Skill.query.get_or_404(skill_id)
    db.session.delete(skill)
    db.session.commit()
    return jsonify({"message": "Skill deleted"}), 200



# Projects



@app.route("/api/projects", methods=["GET"])
def get_projects():
    projects = Project.query.order_by(Project.id.desc()).all()
    return jsonify([project.to_dict() for project in projects])


@app.route("/api/projects", methods=["POST"])
def add_project():
    if not session.get("is_admin"):
        return jsonify({"message": "Login required"}), 401
    data = request.get_json() or {}
    title = (data.get("title") or "").strip()
    problem = (data.get("problem") or "").strip()
    action = (data.get("action") or "").strip()
    result = (data.get("result") or "").strip()
    github_url = (data.get("github_url") or "").strip()
    linkedin_url = (data.get("linkedin_url") or "").strip()

    if not title:
        return jsonify({"message": "Project title is required"}), 400

    project = Project(
        title=title,
        problem=problem,
        action=action,
        result=result,
        github_url=github_url,
        linkedin_url=linkedin_url,
    )

    db.session.add(project)
    db.session.commit()

    return jsonify({
        "message": "Project added successfully",
        "project": project.to_dict()
    }), 201
    
@app.route("/api/projects/<int:project_id>", methods=["PUT"])
def update_project(project_id):
    if not session.get("is_admin"):
        return jsonify({"message": "Login required"}), 401
    project = Project.query.get_or_404(project_id)
    data = request.get_json() or {}

    if data.get("title") is not None:
        project.title = (data.get("title") or "").strip()
    if data.get("problem") is not None:
        project.problem = (data.get("problem") or "").strip()
    if data.get("action") is not None:
        project.action = (data.get("action") or "").strip()
    if data.get("result") is not None:
        project.result = (data.get("result") or "").strip()
    if data.get("github_url") is not None:
        project.github_url = (data.get("github_url") or "").strip()
    if data.get("linkedin_url") is not None:
        project.linkedin_url = (data.get("linkedin_url") or "").strip()

    if not project.title:
        return jsonify({"message": "Project title is required"}), 400

    db.session.commit()

    return jsonify({
        "message": "Project updated successfully",
        "project": project.to_dict()
    })


@app.route("/api/projects/<int:project_id>", methods=["DELETE"])
def delete_project(project_id):
    if not session.get("is_admin"):
        return jsonify({"message": "Login required"}), 401
    project = Project.query.get_or_404(project_id)
    db.session.delete(project)
    db.session.commit()

    return jsonify({"message": "Project deleted successfully"}), 200

# Certifications


@app.route("/api/certifications", methods=["GET"])
def get_certifications():
    certs = Certification.query.order_by(Certification.id.desc()).all()
    return jsonify([cert.to_dict() for cert in certs])


@app.route("/api/certifications", methods=["POST"])
def add_certification():
    if not session.get("is_admin"):
        return jsonify({"message": "Login required"}), 401
    data = request.get_json() or {}

    name = (data.get("name") or "").strip()
    issuer = (data.get("issuer") or "").strip()
    issue_date = parse_date(data.get("issue_date"))
    credential_url = (data.get("credential_url") or "").strip()

    if not name:
        return jsonify({"message": "Certification name is required"}), 400

    certification = Certification(
        name=name,
        issuer=issuer,
        issue_date=issue_date,
        credential_url=credential_url,
    )

    db.session.add(certification)
    db.session.commit()

    return jsonify({
        "message": "Certification added successfully",
        "certification": certification.to_dict()
    }), 201
    

@app.route("/api/certifications/<int:cert_id>", methods=["PUT"])
def update_certification(cert_id):
    if not session.get("is_admin"):
        return jsonify({"message": "Login required"}), 401
    certification = Certification.query.get_or_404(cert_id)
    data = request.get_json() or {}

    if data.get("name") is not None:
        certification.name = (data.get("name") or "").strip()
    if data.get("issuer") is not None:
        certification.issuer = (data.get("issuer") or "").strip()
    if data.get("issue_date") is not None:
        certification.issue_date = parse_date(data.get("issue_date"))
    if data.get("credential_url") is not None:
        certification.credential_url = (data.get("credential_url") or "").strip()

    if not certification.name:
        return jsonify({"message": "Certification name is required"}), 400

    db.session.commit()

    return jsonify({
        "message": "Certification updated successfully",
        "certification": certification.to_dict()
    })


@app.route("/api/certifications/<int:cert_id>", methods=["DELETE"])
def delete_certification(cert_id):
    if not session.get("is_admin"):
        return jsonify({"message": "Login required"}), 401
    certification = Certification.query.get_or_404(cert_id)
    db.session.delete(certification)
    db.session.commit()

    return jsonify({"message": "Certification deleted successfully"}), 200

# Education



@app.route("/api/education", methods=["GET"])
def get_education():
    education_list = Education.query.order_by(Education.id.desc()).all()
    return jsonify([edu.to_dict() for edu in education_list])


@app.route("/api/education", methods=["POST"])
def add_education():
    if not session.get("is_admin"):
        return jsonify({"message": "Login required"}), 401
    data = request.get_json() or {}
    school_name = (data.get("school_name") or "").strip()
    degree = (data.get("degree") or "").strip()
    grade = (data.get("grade") or "").strip()
    field_of_study = (data.get("field_of_study") or "").strip()
    start_date = parse_date(data.get("start_date"))
    end_date = parse_date(data.get("end_date"))

    if not school_name:
        return jsonify({"message": "School name is required"}), 400

    education = Education(
        school_name=school_name,
        degree=degree,
        grade=grade,
        field_of_study=field_of_study,
        start_date=start_date,
        end_date=end_date,
    )

    db.session.add(education)
    db.session.commit()

    return jsonify({
        "message": "Education added successfully",
        "education": education.to_dict()
    }), 201

@app.route("/api/education/<int:edu_id>", methods=["PUT"])
def update_education(edu_id):
    if not session.get("is_admin"):
        return jsonify({"message": "Login required"}), 401
    education = Education.query.get_or_404(edu_id)
    data = request.get_json() or {}
    if data.get("school_name") is not None:
        education.school_name = (data.get("school_name") or "").strip()
    if data.get("degree") is not None:
        education.degree = (data.get("degree") or "").strip()
    if data.get("field_of_study") is not None:
        education.field_of_study = (data.get("field_of_study") or "").strip()
    if data.get("start_date") is not None:
        education.start_date = parse_date(data.get("start_date"))
    if data.get("end_date") is not None:
        education.end_date = parse_date(data.get("end_date"))

    if not education.school_name:
        return jsonify({"message": "School name is required"}), 400

    db.session.commit()

    return jsonify({
        "message": "Education updated successfully",
        "education": education.to_dict()
    })
    

@app.route("/api/education/<int:edu_id>", methods=["DELETE"])
def delete_education(edu_id):
    if not session.get("is_admin"):
        return jsonify({"message": "Login required"}), 401
    education = Education.query.get_or_404(edu_id)
    db.session.delete(education)
    db.session.commit()

    return jsonify({"message": "Education deleted successfully"}), 200

# Feedback

@app.route("/api/feedback", methods=["GET"])
def get_feedback():
    feedback_list = Feedback.query.order_by(Feedback.created_at.desc()).all()
    return jsonify([item.to_dict() for item in feedback_list])


@app.route("/api/feedback", methods=["POST"])
def add_feedback():
    if not session.get("is_admin"):
        return jsonify({"message": "Login required"}), 401

    data = request.get_json() or {}

    name = (data.get("name") or "").strip()
    role_or_linkedin = (data.get("role_or_linkedin") or "").strip()
    comment = (data.get("comment") or "").strip()

    if not name:
        return jsonify({"message": "Name is required"}), 400

    if not comment:
        return jsonify({"message": "Comment is required"}), 400

    feedback = Feedback(
        name=name,
        role_or_linkedin=role_or_linkedin,
        comment=comment,
    )

    db.session.add(feedback)
    db.session.commit()

    return jsonify({
        "message": "Feedback submitted successfully",
        "feedback": feedback.to_dict()
    }), 201


@app.route("/api/feedback/<int:feedback_id>/read", methods=["PUT"])
def mark_feedback_read(feedback_id):
    if not session.get("is_admin"):
        return jsonify({"message": "Login required"}), 401
    feedback = Feedback.query.get_or_404(feedback_id)
    data = request.get_json() or {}

    feedback.is_read = bool(data.get("is_read", True))
    db.session.commit()

    return jsonify({
        "message": "Feedback read status updated successfully",
        "feedback": feedback.to_dict()
    })


@app.route("/api/feedback/<int:feedback_id>/hide", methods=["PUT"])
def hide_feedback(feedback_id):
    if not session.get("is_admin"):
        return jsonify({"message": "Login required"}), 401
    feedback = Feedback.query.get_or_404(feedback_id)
    data = request.get_json() or {}

    feedback.is_hidden = bool(data.get("is_hidden", True))
    db.session.commit()

    return jsonify({
        "message": "Feedback hidden status updated successfully",
        "feedback": feedback.to_dict()
    })


@app.route("/api/feedback/<int:feedback_id>", methods=["DELETE"])
def delete_feedback(feedback_id):
    if not session.get("is_admin"):
        return jsonify({"message": "Login required"}), 401
    feedback = Feedback.query.get_or_404(feedback_id)
    db.session.delete(feedback)
    db.session.commit()

    return jsonify({"message": "Feedback deleted successfully"}), 


# Working On

@app.route("/api/working_on", methods=["GET"])
def get_working_on():
    working_on = WorkingOn.query.order_by(WorkingOn.id.asc()).all()
    return jsonify([work.to_dict() for work in working_on])


@app.route("/api/working_on", methods=["POST"])
def add_working_on():
    if not session.get("is_admin"):
        return jsonify({"message": "Login required"}), 401
    
    data = request.get_json() or {}

    title = (data.get("title") or "").strip()
    description = (data.get("description") or "").strip()
    github_url = (data.get("github_url") or "").strip()

    if not title:
        return jsonify({"message": "Title is required"}), 400

    work = WorkingOn(
        title=title,
        description=description,
        github_url=github_url,
    )

    db.session.add(work)
    db.session.commit()

    return jsonify({
        "message": "Work item added successfully",
        "work": work.to_dict()
    }), 201

@app.route("/api/working_on/<int:work_id>", methods=["PUT"])
def update_working_on(work_id):
    if not session.get("is_admin"):
        return jsonify({"message": "Login required"}), 401
    work = WorkingOn.query.get_or_404(work_id)
    data = request.get_json() or {}
    if data.get("title") is not None:
        work.title = (data.get("title") or "").strip()
    if data.get("description") is not None:
        work.description = (data.get("description") or "").strip()
    if data.get("github_url") is not None:
        work.github_url = (data.get("github_url") or "").strip()

    if not work.title:
        return jsonify({"message": "Title is required"}), 400

    db.session.commit()

    return jsonify({
        "message": "Work item updated successfully",
        "work": work.to_dict()
    })

@app.route("/api/working_on/<int:work_id>", methods=["DELETE"])
def delete_working_on(work_id):
    if not session.get("is_admin"):
        return jsonify({"message": "Login required"}), 401
    work = WorkingOn.query.get_or_404(work_id)
    db.session.delete(work)
    db.session.commit()

    return jsonify({"message": "Work item deleted successfully"}), 200


# Featured Projects


@app.route("/api/featured_projects", methods=["GET"])
def get_featured_projects():
    featured_projects = FeaturedProject.query.order_by(FeaturedProject.id.asc()).all()
    return jsonify([featured.to_dict() for featured in featured_projects])


@app.route("/api/featured_projects", methods=["POST"])
def add_featured_project():
    if not session.get("is_admin"):
        return jsonify({"message": "Login required"}), 401
    data = request.get_json() or {}
    title = (data.get("title") or "").strip()
    description = (data.get("description") or "").strip()
    github_url = (data.get("github_url") or "").strip()

    if not title:
        return jsonify({"message": "Title is required"}), 400

    featured = FeaturedProject(
        title=title,
        description=description,
        github_url=github_url,
    )

    db.session.add(featured)
    db.session.commit()

    return jsonify({
        "message": "Featured project added successfully",
        "featured": featured.to_dict()
    }), 201
    
@app.route("/api/featured_projects/<int:featured_id>", methods=["PUT"])
def update_featured_project(featured_id):
    if not session.get("is_admin"):
        return jsonify({"message": "Login required"}), 401
    featured = FeaturedProject.query.get_or_404(featured_id)
    data = request.get_json() or {}
    if data.get("title") is not None:
        featured.title = (data.get("title") or "").strip()
    if data.get("description") is not None:
        featured.description = (data.get("description") or "").strip()
    if data.get("github_url") is not None:
        featured.github_url = (data.get("github_url") or "").strip()

    if not featured.title:
        return jsonify({"message": "Title is required"}), 400

    db.session.commit()

    return jsonify({
        "message": "Featured project updated successfully",
        "featured": featured.to_dict()
    })
    
@app.route("/api/featured_projects/<int:featured_id>", methods=["DELETE"])
def delete_featured_project(featured_id):
    if not session.get("is_admin"):
        return jsonify({"message": "Login required"}), 401
    featured = FeaturedProject.query.get_or_404(featured_id)
    db.session.delete(featured)
    db.session.commit()

    return jsonify({"message": "Featured project deleted successfully"}), 200

def test123():
    return "test route works"


# Why Work With Me


@app.route("/api/why_work_with_me", methods=["GET"])
def get_why_work_with_me():
    items = WhyWorkWithMe.query.order_by(WhyWorkWithMe.id.asc()).all()
    return jsonify([item.to_dict() for item in items])


@app.route("/api/why_work_with_me", methods=["POST"])
def add_why_work_with_me():
    if not session.get("is_admin"):
        return jsonify({"message": "Login required"}), 401
    data = request.get_json() or {}

    title = (data.get("title") or "").strip()
    description = (data.get("description") or "").strip()

    if not title:
        return jsonify({"message": "Title is required"}), 400

    item = WhyWorkWithMe(
        title=title,
        description=description,
    )

    db.session.add(item)
    db.session.commit()

    return jsonify({
        "message": "Why Work With Me item added successfully",
        "item": item.to_dict()
    }), 201

@app.route("/api/why_work_with_me/<int:item_id>", methods=["PUT"])
def update_why_work_with_me(item_id):
    if not session.get("is_admin"):
        return jsonify({"message": "Login required"}), 401
    item = WhyWorkWithMe.query.get_or_404(item_id)
    data = request.get_json() or {}
    if data.get("title") is not None:
        item.title = (data.get("title") or "").strip()
    if data.get("description") is not None:
        item.description = (data.get("description") or "").strip()

    if not item.title:
        return jsonify({"message": "Title is required"}), 400

    db.session.commit()

    return jsonify({
        "message": "Why Work With Me item updated successfully",
        "item": item.to_dict()
    })
    
@app.route("/api/why_work_with_me/<int:item_id>", methods=["DELETE"])
def delete_why_work_with_me(item_id):
    if not session.get("is_admin"):
        return jsonify({"message": "Login required"}), 401
    item = WhyWorkWithMe.query.get_or_404(item_id)
    db.session.delete(item)
    db.session.commit()

    return jsonify({"message": "Why Work With Me item deleted successfully"}), 200

with app.app_context():
    db.create_all()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)