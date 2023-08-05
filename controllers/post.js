const Post = require('../models/post');
const ConflictException = require('../exceptions/conflict-exception');

exports.createPost = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            throw new Error('사용자를 찾지 못했습니다');
        }

        const { title, content } = req.body;
        if (!title || !content) {
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

exports.getPosts = async (req, res) => {
    try {
        const page = req.query.page || 1; // 쿼리 파라미터로 페이지 번호 가져옴 / 없으면 기본 값은 1
        const pageSize = 10; // 한 페이지당 게시글 10개

        const offset = (page - 1) * pageSize;
        const { count, rows } = await Post.findAndCountAll({
            limit: pageSize,
            offset,
            order: [['updatedAt', 'DESC']], // 내림차순(최신순)
        });

        const totalPages = Math.ceil(count / pageSize);

        if (page < 1 || page > totalPages) {
            return res.status(400).json({ error: '유효하지 않은 페이지 번호입니다.' });
        }

        res.status(200).json({
            currentPage: page, // 현재 페이지 번호
            totalPages, // 전체 페이지 수
            posts: rows, // 요청한 페이지의 게시글 목록
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findByPk(postId);

        if (!post) {
            return res.status(404).json({ error: '해당 게시글을 찾을 수 없습니다' });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const { title, content } = req.body;

        if (!title && !content) {
            throw new Error('제목과 내용을 입력해주세요');
        }

        const post = await Post.findByPk(postId);

        if (!post) {
            return res.status(404).json({ error: '해당 게시글을 찾을 수 없습니다' });
        }

        // 게시글의 작성자와 현재 사용자의 ID를 비교
        const userId = req.userId;

        if (post.userId !== userId) {
            return res.status(403).json({ error: '게시글 작성자만 수정할 수 있습니다.' });
        }

        if (title) {
            post.title = title;
        }

        if (content) {
            post.content = content;
        }
        await post.save();

        res.status(200).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.softDeletePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findByPk(postId);

        if (!post) {
            return res.status(404).json({ error: '해당 게시글을 찾을 수 없습니다' });
        }

        // 게시글의 작성자와 현재 사용자의 ID를 비교
        const userId = req.userId;

        if (post.userId !== userId) {
            return res.status(403).json({ error: '게시글 작성자만 삭제할 수 있습니다.' });
        }

        // 소프트 삭제
        await post.destroy({ force: false });

        res.status(200).json({ message: '게시글이 성공적으로 삭제되었습니다.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
