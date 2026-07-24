jQuery(document).ready(function($) {
    let frame;
    const list = $('#dr-docs-list');
    const input = $('#dr_docs');

    $('#dr-add-docs').on('click', function(e) {
        e.preventDefault();
        if (frame) { frame.open(); return; }

        frame = wp.media({
            title: 'Select Documents',
            button: { text: 'Attach' },
            multiple: true,
            library: { type: null } // allow all files
        });

        frame.on('select', function() {
            const attachments = frame.state().get('selection').toJSON();
            let ids = input.val() ? input.val().split(',').map(Number) : [];

            attachments.forEach(att => {
                if (!ids.includes(att.id)) {
                    ids.push(att.id);
                    list.append(
                        `<li data-id="${att.id}">${att.title} <button class="dr-remove-doc">×</button></li>`
                    );
                }
            });

            input.val(ids.join(','));
        });

        frame.open();
    });

    list.on('click', '.dr-remove-doc', function(e) {
        e.preventDefault();
        const li = $(this).closest('li');
        const id = parseInt(li.data('id'), 10);
        let ids = input.val() ? input.val().split(',').map(Number) : [];
        ids = ids.filter(val => val !== id);
        input.val(ids.join(','));
        li.remove();
    });
});
