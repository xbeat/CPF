from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="cpf-validation",
    version="1.0.0",
    author="Giuseppe Canale",
    author_email="kaolay@gmail.com",
    description="Cybersecurity Psychology Framework Validation",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/giuseppe-canale/cpf-validation",
    packages=find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.8",
    install_requires=[
        "numpy>=1.21.0",
        "pandas>=1.3.0",
        "scipy>=1.7.0",
        "scikit-learn>=1.0.0",
        "pgmpy>=0.1.18",
        "networkx>=2.6.0",
    ],
)
