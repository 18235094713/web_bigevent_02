$(function() {
    initArtCateList();
    // 封装函数
    function initArtCateList() {
        $.ajax({
            // method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
            }
        })
    }

    var layer = layui.layer;
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    var indexAdd = null;
    // 通过代理的形式 为form-add表单绑定submit事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                initArtCateList();
                layer.msg('新增分类成功！');
                // 根据索引，关闭对应的弹出层
                layer.close(indexAdd);
            }
        })
    })

    // 通过代理的形式 为修改表单绑定click
    var indexEdit = null;
    var form = layui.form;
    $('tbody').on('click', '.btn-edit', function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });

        var Id = $(this).attr('data-id');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + Id,
            success: function(res) {
                form.val('form-edit', res.data);
            }
        })
    })

    // 修改 提交
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败');
                }
                initArtCateList();
                layer.msg('更新分类数据成功');
                layer.close(indexEdit);
            }
        })
    })

    // 删除
    $('tbody').on('click', '.btn-delete', function() {
        var Id = $(this).attr('data-id');
        // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + Id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    initArtCateList();
                    layer.msg('删除分类成功！');
                    layer.close(index);
                }
            })
        })
    })

})