function checkUserData(){
    const url = new URL(location.href);
    const firstName = url.searchParams.get('firstName');
    const lastName = url.searchParams.get('lastName');
    const email = url.searchParams.get('email');

    if (!firstName || !lastName || !email){
        location.href = './index.html';
    };
}