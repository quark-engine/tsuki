window.addEventListener('message', event => {
    if (event.origin === window.location.origin) {
        const { code, context } = event.data;
        try {
            with (context) {
                eval(code);
            }
        } catch (error) {
            console.error('Error executing sandbox code:', error);
        }
    }
});