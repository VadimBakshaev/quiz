(function(){
    const Result = {
        init(){
            const url = new URL(location.href);
            const user = JSON.parse(sessionStorage.getItem('user'));
            document.querySelector('.result-score')
            .innerText = `${user.score}/${user.total}`;
            //document.querySelector('.result-score')
            //.innerText = `${url.searchParams.get('score')}/${url.searchParams.get('total')}`;
        }
    };
    Result.init();
})();