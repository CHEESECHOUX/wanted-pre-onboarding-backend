const Post = require('../models/post');
const ConflictException = require('../exceptions/conflict-exception');

exports.createPost = async (req, res) => {
    try {
        const { title, content, userId } = req.body;

        if (!title || !content || !userId) {
            throw new Error('제목과 내용을 입력해주세요');
        }

        const existingPost = await Post.findOne({ where: { title } });

        if (existingPost) {
            throw new ConflictException('동일한 제목의 게시물이 존재합니다.');
        }

        const post = await Post.create({ title, content, userId });

        res.status(201).json(post);
    } catch (error) {
        console.error(error);
        if (error.name === 'ConflictException') {
            res.status(409).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};
