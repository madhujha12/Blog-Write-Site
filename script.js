document.addEventListener("DOMContentLoaded", () => {
    const createPostButton = document.getElementById("createPostButton");
    const createBlogModal = document.getElementById("createBlogModal");
    const closeModal = document.getElementById("closeModal");
    const submitBlogButton = document.getElementById("submitBlogButton");
    const titleInput = document.getElementById("title");
    const contentInput = document.getElementById("content");
    const imageUpload = document.getElementById("imageUpload");
    const postsContainer = document.getElementById("postsContainer");
    const previewTitle = document.getElementById("previewTitle");
    const previewContent = document.getElementById("previewContent");
    const previewImage = document.getElementById("previewImage");

    let posts = JSON.parse(localStorage.getItem("posts")) || []; 
    let editingPostId = null;
    const currentUser = "Madhu";

    function savePosts() {
        localStorage.setItem("posts", JSON.stringify(posts)); 
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

            const ownerElement = document.createElement("p");
            ownerElement.textContent = `By: ${post.owner} | ${post.timestamp}`;

            if (post.image) {
                const imageElement = document.createElement("img");
                imageElement.src = post.image;
                imageElement.alt = "Blog Image";
                imageElement.style.width = "100%";
                postElement.appendChild(imageElement);
            }

            postElement.appendChild(ownerElement);
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

    function createOrUpdatePost() {
        const title = titleInput.value;
        const content = contentInput.value;
        const image = imageUpload.files[0];

        if (title && content) {
            const postData = {
                title,
                content,
                owner: currentUser,
                timestamp: new Date().toLocaleString(),
            };

            if (image) {
                const reader = new FileReader();
                reader.onloadend = function () {
                    postData.image = reader.result; 
                    savePost(postData);
                };
                reader.readAsDataURL(image); 
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

        savePosts(); 
        displayPosts();
        closeModalFunction();
    }

    function editPost(post) {
        titleInput.value = post.title;
        contentInput.value = post.content;
        editingPostId = post.id;
        openModal(true);
    }

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
        previewTitle.textContent = "";
        previewContent.textContent = "";
        previewImage.src = "";
    }

    function closeModalFunction() {
        createBlogModal.style.display = "none";
    }

    function updatePreview() {
        previewTitle.textContent = titleInput.value;
        previewContent.textContent = contentInput.value;
        if (imageUpload.files[0]) {
            const reader = new FileReader();
            reader.onloadend = function () {
                previewImage.src = reader.result;
            };
            reader.readAsDataURL(imageUpload.files[0]);
        } else {
            previewImage.src = "";
        }
    }

    createPostButton.addEventListener("click", () => openModal());
    closeModal.addEventListener("click", closeModalFunction);
    submitBlogButton.addEventListener("click", createOrUpdatePost);
    titleInput.addEventListener("input", updatePreview);
    contentInput.addEventListener("input", updatePreview);
    imageUpload.addEventListener("change", updatePreview);

    displayPosts();

    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    const menuLinks = document.querySelectorAll('.mobile-nav ul li a');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
});

menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileNav.classList.remove('active');
    });
});

});
