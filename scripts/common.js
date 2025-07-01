function checkUserData(){    
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user.firstName || !user.lastName || !user.email){
        location.href = './index.html';
    };    
}