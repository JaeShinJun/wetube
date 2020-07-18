import axios from 'axios';

const delBtns = document.querySelectorAll('.comment__delBtn');
const commentList = document.getElementById('jsCommentList');
const commentNumber = document.getElementById('jsCommentNumber');

const decreaseNumber = () => {
    commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) - 1;
};

const deleteComment = (li) => {
    commentList.removeChild(li);
    decreaseNumber();
};

const delBtnClickHandle = async (event) => {
    const li = event.target.parentNode.parentNode;
    const commentId = li.className;
    const response = await axios({
        url: `/api/comment/${commentId}/delete`,
        method: 'POST',
    });

    if (response.status === 200) {
        deleteComment(li);
    }
};

const init = () => {
    delBtns.forEach((delBtn) => {
        delBtn.addEventListener('click', delBtnClickHandle);
    });
};

if (delBtns) {
    init();
}
