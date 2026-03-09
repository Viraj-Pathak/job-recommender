"""
Generates synthetic users, jobs, and interaction data.
"""

import random
import pandas as pd
import numpy as np

random.seed(42)
np.random.seed(42)

SKILLS_POOL = [
    "python", "java", "javascript", "sql", "machine learning", "deep learning",
    "data analysis", "react", "node.js", "aws", "docker", "kubernetes",
    "project management", "agile", "communication", "excel", "tableau",
    "tensorflow", "pytorch", "nlp", "computer vision", "c++", "rust",
    "product management", "ux design", "figma", "marketing", "seo",
]

JOB_TITLES = [
    ("Data Scientist", ["python", "machine learning", "sql", "data analysis", "tensorflow", "nlp"]),
    ("Software Engineer", ["python", "java", "javascript", "docker", "aws", "c++"]),
    ("Frontend Developer", ["javascript", "react", "figma", "ux design", "css", "html"]),
    ("Backend Developer", ["python", "node.js", "sql", "docker", "aws", "java"]),
    ("ML Engineer", ["python", "machine learning", "deep learning", "pytorch", "docker", "kubernetes"]),
    ("Data Analyst", ["sql", "excel", "tableau", "data analysis", "python", "communication"]),
    ("DevOps Engineer", ["docker", "kubernetes", "aws", "linux", "python", "agile"]),
    ("Product Manager", ["product management", "agile", "communication", "project management", "ux design"]),
    ("NLP Engineer", ["python", "nlp", "deep learning", "tensorflow", "machine learning", "pytorch"]),
    ("Computer Vision Engineer", ["python", "computer vision", "deep learning", "pytorch", "c++", "tensorflow"]),
    ("Marketing Analyst", ["marketing", "seo", "excel", "tableau", "communication", "data analysis"]),
    ("Rust Developer", ["rust", "c++", "python", "docker", "aws"]),
]

COMPANIES = [
    "TechCorp", "DataFlow Inc", "CloudBase", "InnovateTech",
    "NextGen AI", "ByteWorks", "PixelSoft", "AgileHub",
]

LOCATIONS = ["Remote", "New York", "San Francisco", "Austin", "Seattle", "London", "Berlin"]

EXPERIENCE_LEVELS = ["Junior", "Mid", "Senior"]


def generate_jobs(n: int = 50) -> pd.DataFrame:
    jobs = []
    for i in range(n):
        title, core_skills = random.choice(JOB_TITLES)
        extra_skills = random.sample(SKILLS_POOL, k=random.randint(1, 3))
        required_skills = list(set(core_skills + extra_skills))
        exp_level = random.choice(EXPERIENCE_LEVELS)
        salary = random.randint(50, 200) * 1000

        description = (
            f"{exp_level} {title} at {random.choice(COMPANIES)} in {random.choice(LOCATIONS)}. "
            f"Required skills: {', '.join(required_skills)}. "
            f"Salary: ${salary:,}."
        )

        jobs.append({
            "job_id": i,
            "title": f"{exp_level} {title}",
            "required_skills": " ".join(required_skills),
            "description": description,
            "salary": salary,
            "experience_level": exp_level,
        })
    return pd.DataFrame(jobs)


def generate_users(n: int = 30) -> pd.DataFrame:
    users = []
    for i in range(n):
        num_skills = random.randint(3, 8)
        skills = random.sample(SKILLS_POOL, k=num_skills)
        exp_years = random.randint(0, 15)
        exp_level = "Junior" if exp_years < 2 else ("Mid" if exp_years < 6 else "Senior")

        users.append({
            "user_id": i,
            "name": f"User_{i}",
            "skills": " ".join(skills),
            "experience_years": exp_years,
            "experience_level": exp_level,
        })
    return pd.DataFrame(users)


def generate_interactions(users: pd.DataFrame, jobs: pd.DataFrame, sparsity: float = 0.15) -> pd.DataFrame:
    """
    Generates a user-job interaction matrix (1 = applied/liked, 0 = no interaction).
    Users are more likely to interact with jobs matching their skills.
    """
    records = []
    for _, user in users.iterrows():
        user_skills = set(user["skills"].split())
        for _, job in jobs.iterrows():
            job_skills = set(job["required_skills"].split())
            overlap = len(user_skills & job_skills) / max(len(job_skills), 1)
            # Higher overlap → higher chance of interaction
            prob = min(overlap * 0.8 + 0.05, 1.0) if overlap > 0 else sparsity * 0.3
            if random.random() < prob:
                records.append({"user_id": user["user_id"], "job_id": job["job_id"], "interaction": 1})

    return pd.DataFrame(records)


if __name__ == "__main__":
    jobs = generate_jobs(50)
    users = generate_users(30)
    interactions = generate_interactions(users, jobs)

    print(f"Jobs: {len(jobs)}")
    print(f"Users: {len(users)}")
    print(f"Interactions: {len(interactions)} ({len(interactions) / (len(users) * len(jobs)) * 100:.1f}% density)")
    print("\nSample job:\n", jobs.iloc[0].to_dict())
    print("\nSample user:\n", users.iloc[0].to_dict())
