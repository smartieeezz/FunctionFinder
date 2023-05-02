const logIn = document.getElementById('login');
const signOut = document.getElementById('signOut');


logIn.addEventListener('click', (event) => {
    event.preventDefault();
    signOut.classList.remove('hidden');
    logIn.classList.add('hidden');
    logIn.click();
});

signOut.addEventListener('click', (event) => {
    event.preventDefault();
    logIn.classList.remove('hidden');
    signOut.classList.add('hidden');
    signOut.click();
});