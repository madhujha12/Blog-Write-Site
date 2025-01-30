document.addEventListener("DOMContentLoaded", () => {
    const createPostButton = document.getElementById("createPostButton");
    const createBlogModal = document.getElementById("createBlogModal");
    const closeModal = document.getElementById("closeModal");
    const submitBlogButton = document.getElementById("submitBlogButton");
    const titleInput = document.getElementById("title");
    const contentInput = document.getElementById("content");
    const imageUpload = document.getElementById("imageUpload");
    const postsContainer = document.getElementById("postsContainer");

    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    let editingPostId = null;
    const currentUser = "admin";

    function openModal(isEdit = false) {
        createBlogModal.style.display = "flex";
        if (isEdit) {
            document.getElementById("modalTitle").textContent = "Edit Blog Post";
            submitBlogButton.textContent = "Update Post";
        } else {
            document.getElementById("modalTitle").textContent = "Create a New Blog";
            submitBlogButton.textContent = "Submit";
            titleInput.value = "";
            contentInput.value = "";
            imageUpload.value = "";
            editingPostId = null;
        }
    }

    function closeModalFunction() {
        createBlogModal.style.display = "none";
    }

    function createOrUpdatePost() {
        const title = titleInput.value;
        const content = contentInput.value;
        const image = imageUpload.files[0];

        if (title && content) {
            const postData = { title, content, owner: currentUser };

            // If there's an image, convert it to base64 and add to the postData
            if (image) {
                const reader = new FileReader();
                reader.onloadend = function () {
                    postData.image = reader.result; // Base64 string of the image
                    savePost(postData);
                };
                reader.readAsDataURL(image); // Convert image to base64
            } else {
                savePost(postData);
            }
        }
    }

    function savePost(postData) {
        if (editingPostId !== null) {
            const postIndex = posts.findIndex(post => post.id === editingPostId);
            posts[postIndex] = { ...posts[postIndex], ...postData };
        } else {
            postData.id = Date.now();
            posts.push(postData);
        }

        localStorage.setItem("posts", JSON.stringify(posts)); // Store posts in localStorage
        displayPosts();
        closeModalFunction();
    }

    function displayPosts() {
        postsContainer.innerHTML = "";

        posts.forEach(post => {
            const postElement = document.createElement("div");
            postElement.classList.add("post");

            const titleElement = document.createElement("h3");
            titleElement.textContent = post.title;

            const contentElement = document.createElement("p");
            contentElement.textContent = post.content;

            if (post.image) {
                const imageElement = document.createElement("img");
                imageElement.src = post.image; // Use the base64 image
                imageElement.alt = "Blog Image";
                imageElement.style.width = "100%";
                postElement.appendChild(imageElement);
            }

            postElement.appendChild(titleElement);
            postElement.appendChild(contentElement);

            if (post.owner === currentUser) {
                const editButton = document.createElement("button");
                editButton.textContent = "Edit";
                editButton.addEventListener("click", () => editPost(post));
                postElement.appendChild(editButton);
            }

            postsContainer.appendChild(postElement);
        });
    }

    function editPost(post) {
        titleInput.value = post.title;
        contentInput.value = post.content;
        editingPostId = post.id;
        openModal(true);
    }

    createPostButton.addEventListener("click", () => openModal());
    closeModal.addEventListener("click", closeModalFunction);
    submitBlogButton.addEventListener("click", createOrUpdatePost);
    displayPosts();
});
