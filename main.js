function _(str) {
    return document.querySelector(str);
}
/*Reg Page*/
const regForm = _("#regForm");

if (regForm) {
    _('#loading-gif').style.display = "none";

    regForm.addEventListener('submit', function (e) {
        _('#loading-gif').style.display = "block";
        e.preventDefault();
        const username = _("#rusername").value;
        const email = _("#remail").value;
        const pwd = _("#rpwd").value;
        const phone = _("#rphone").value;

        const userData = {
            username: username,
            email: email,
            password: pwd,
            phone: phone
        }

        const registerUrl = "https://goalsetapp.herokuapp.com/api/register";


        axios.post(registerUrl, userData).then(function (response) {
            console.log(response.data);
            console.log("set token")
            localStorage.setItem('goaltoken', response.data.data.token);

            console.log("about to switch to dashboard")
            location.replace("dashboard.html");
        }).catch(function (err) {
            _('#loading-gif').style.display = "none";
            console.log(err.response)
            if(err.response.data.hasOwnProperty("email")){
                let message = err.response.data.email[0];
                _("#err-email").innerHTML = `${message}`;
            }
            if(err.response.data.hasOwnProperty("password")){
                let message = err.response.data.password[0];
                _("#err-pwd").innerHTML = `${message}`;
            }
            if(err.response.data.hasOwnProperty("username")){
                let message = err.response.data.username[0];
                _("#err-uname").innerHTML = `${message}`;
            }
            if(err.response.data.hasOwnProperty("phone")){
                let message = err.response.data.phone[0];
                _("#err-phone").innerHTML = `${message}`;
            }
           
        })
    })
}
/*Login Page*/
const loginForm = _("#loginForm");
if (loginForm) {
    _('#loading-gif').style.display = "none";
    loginForm.addEventListener('submit', function (e) {
        _('#loading-gif').style.display = "block";
        e.preventDefault();
        const email = _("#lemail").value;
        const pwd = _("#lpwd").value;

        const userData = {
            email: email,
            password: pwd
        }




        const loginUrl = "https://goalsetapp.herokuapp.com/api/login";
        
        axios.post(loginUrl, userData).then(function (response) {
            console.log(response.data)


            const token = response.data.data.token
            console.log(token)

            localStorage.setItem('goaltoken', token);

            location.replace("dashboard.html")
        }).catch(function (err) {
            _('#loading-gif').style.display = "none";
            console.log(err.response)
            if(err.response.data.hasOwnProperty("email")){
                let message = err.response.data.email[0];
                _("#err-email").innerHTML = `${message}`;
            }
            if(err.response.data.hasOwnProperty("password")){
                let message = err.response.data.password[0];
                _("#err-pwd").innerHTML = `${message}`;
            }
            if (err.response.data.hasOwnProperty("error")) {
                _('#error-login').style.display = "block";
                let message = err.response.data.message;
                console.log(message)
                _("#error-login").innerHTML = `${message}`;
            }

        })
    })
}

//View Users
const profile = _("#profile");

console.log(_('#bigName'))

if (profile) {
    const profileUrl = "https://goalsetapp.herokuapp.com/api/profile";
    const token = localStorage.getItem("goaltoken");

    // console.log(token)

    const options = {
        headers: {
            Authorization: token,
        }
    }
    //console.log(_('#basicInfo').innerHTML)

    axios.get(profileUrl, options).then(function (response) {
        //console.log(response.data.data.username);
        // console.log(response.data.data.user)
        const user = response.data.data.user;
        localStorage.setItem('user', user)
        console.log(user)

        console.log(user.username)
        _('#bigName').innerHTML = user.username;

        /* _("#basicInfo").innerHTML = `
            <div class="col-md-8 col-6" >
                ${user.username}
            </div>
            <hr />
            <div class="col-md-8 col-6" >
                ${user.email}
            </div>
            <hr />
            <div class="col-md-8 col-6" >
                ${user.phone}
            </div>
            <hr />
            <div class="col-md-8 col-6" >
                ${new Date(user.created_at).toLocaleDateString()}
            </div>
            <hr />
            `;*/
        _('#username').innerHTML = user.username;
        _('#email').innerHTML = user.email;
        _('#phone').innerHTML = user.phone;
        _('#date-created').innerHTML = new Date(user.created_at).toLocaleDateString();
        _('#loading-gif').style.display = "none";
        _('#spinner-bg').style.display = "none";
        _('#profilebody').style.display = "block";


    }).catch(function (err) {
        console.log(err.response);
    })
}
/*New Goal*/
const goalForm = _("#goalForm");


if (goalForm) {
    console.log('work')
    goalForm.addEventListener('submit', function (e) {
        e.preventDefault();
        _('#add-task-btn').disabled = "true";
        //document.getElementById("add-task-btn").classList.toggle("disabled");
        _('#loading-gif').style.display = "block";

        const goalname = _("#goalname").value;
        const goalbody = _("#goalbody").value;
        const start = _("#goalstart").value;
        const end = _("#goalend").value;

        const goalData = {
            goalname: goalname,
            goalbody: goalbody,
            start: start,
            end: end,
        }

        const postGoalUrl = "https://goalsetapp.herokuapp.com/api/goals/create";
        const token = localStorage.getItem("goaltoken");

        // console.log(token)

        const options = {
            headers: {
                Authorization: token,
            }
        }

        axios.post(postGoalUrl, goalData, options).then(function (response) {
            console.log(response.data);

            const newgoal = response.data.data.goal

            let newnode = `
            <li class="list-group-item list-css text-left col-12 goal-list my-2" data-toggle="modal" data-target="#goal-full-deets${newgoal.gid}">
                    <span class="col-6">${newgoal.goalname}</span> <span class="text-end mx-auto tiny-text">${newgoal.end}</span>
                </li>
            
       <div class="modal fade" id="goal-full-deets${newgoal.gid}" tabindex="-1" role="dialog" aria-labelledby="goal-name" aria-hidden="true">
                <div class="modal-dialog border-brand border-curved" role="document">
                    <div class="modal-content  list-css">
                    <div class="modal-header border-brand">
                        <h5 class="modal-title" id="goal-name">${newgoal.goalname}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body border-brand goal-body">
                        <!--We're going to need date-details here-->
                        ${newgoal.goalbody}
                    </div>
                    <div class="modal-footer border-brand">
                        <button id="delete-goal-btn${newgoal.gid}" onClick="deleteGoal('${newgoal.gid}')" class="btn btn-danger">delete</button>
                        <a class="btn btn-secondary" href="/edit-goal.html?id=${newgoal.gid}">Edit Goal</a>
                        <button type="button" class="btn btn-secondary task-btn" data-dismiss="modal">Close</button>
                        
                    </div>
                    </div>
                </div>
                </div>
                `;

            _('#loading-gif').style.display = "none";


            $('#goals').prepend($(newnode));
            document.getElementById("add-task-btn").classList.toggle("disabled");
            _('#add-task-btn').disabled = "";

        }).catch(function (err) {
            console.log(err)
            console.log(err.response);
            if(err.response.data.hasOwnProperty("goalname")){
                let message = err.response.data.goalname[0];
                _("#err-gname").innerHTML = `${message}`;
            }
            if(err.response.data.hasOwnProperty("goalbody")){
                let message = err.response.data.goalbody[0];
                _("#err-gbody").innerHTML = `${message}`;
            }
            _('#loading-gif').style.display = "none";
            _('#add-task-btn').disabled = "";
        })
    })
}
/*Display Goals*/
let urlParams = new URLSearchParams(location.search);
let goalId = urlParams.get('id');
const fullList = _("#full-list");
if (fullList) {
    console.log('work')
    const showGoalUrl = "https://goalsetapp.herokuapp.com/api/goals";
    const token = localStorage.getItem("goaltoken");
    console.log(token)


    const options = {
        headers: {
            Authorization: token,
        }
    }

    _('#nothing-here').style.display = "none";
    axios.get(showGoalUrl, options).then(function (response) {
        const goal = response.data.data.goals;
        localStorage.setItem('goal', goal)
        console.log('goal is' + goal)

        console.log(response.data)

        _('#loading-gif').style.display = "none";
        _("#full-list").style.display = "block";


        for (let usergoals of goal) {
            goals.innerHTML += `
                <li class="list-group-item list-css text-left col-12 goal-list my-2" data-toggle="modal" data-target="#goal-full-deets${usergoals.gid}">
                    <span class="col-6">${usergoals.goalname}</span> <span class="text-end mx-auto tiny-text">${usergoals.end}</span>
                </li>
                <div class="modal fade" id="goal-full-deets${usergoals.gid}" tabindex="-1" role="dialog"
                        aria-labelledby="goal-name" aria-hidden="true">
                        <div class="modal-dialog border-brand border-curved" role="document">
                            <div class="modal-content  list-css">
                                <div class="modal-header border-brand">
                                    <h5 class="modal-title" id="goal-name">${usergoals.goalname}</h5></br>
                                    <!--<div class="ml-5 med-text">
                                        <span>${usergoals.start}</span>
                                        <span>to</span>
                                    </div>-->
                                    
                                    
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>

                                </div>
                                <div class="modal-body border-brand goal-body">
                                    <div class="goal-desc text-left">
                                        <!--We're going to need date-details here-->
                                        ${usergoals.goalbody}
                                    </div>

                                    

                                </div>

                                <div class="modal-footer border-brand">
                                    <button id="delete-goal-btn${usergoals.gid}"
                                        onClick="deleteGoal('${usergoals.gid}')" class="btn btn-danger">delete</button>
                                    <a class="btn btn-secondary" href="edit-goal.html?id=${usergoals.gid}">View Goal</a>
                                    <button type="button" class="btn btn-secondary task-btn"
                                        data-dismiss="modal">Close</button>

                                </div>
                            </div>
                        </div>
                    </div>
                `;
            _('#loading-gif').style.display = "none";

        }





    })

}



/*Edit Goals*/
const editGoalForm = _("#editGoalForm");
//let queryString = location.search;

console.log(goalId);
if (editGoalForm) {
    console.log('work')
    const editGoalUrl = `https://goalsetapp.herokuapp.com/api/goals/${goalId}/edit`;
    const token = localStorage.getItem("goaltoken");


    const options = {
        headers: {
            Authorization: token,
        }
    }

    axios.get(editGoalUrl, options).then(function (response) {
        const goal = response.data.data.goal;
        localStorage.setItem('goal', goal)

        console.log(goal)
        _('#goal-name').value = goal.goalname;
        _('#goal-body').value = goal.goalbody;
        _('#goalstart').value = goal.start;
        _('#goalend').value = goal.end;


    }).catch(function (err) {
        console.log(err)
        console.log('err is ' + err.response);
    })

    editGoalForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const goalname = _("#goal-name").value;
        const goalbody = _("#goal-body").value;

        const updatedGoalData = {
            goalname: goalname,
            goalbody: goalbody,

        }
        const options = {
            headers: {
                Authorization: token,
            }
        }

        const updateGoalUrl = `https://goalsetapp.herokuapp.com/api/goals/${goalId}/update`;

        axios.put(updateGoalUrl, updatedGoalData, options).then(function (response) {
            console.log(response.data);
            //let message = response.data.goal.message;
            _("#updateSuccess").style.display = "block";
            //_("#updateSuccess").fadeOut("slow");
            _('#updateSuccess').innerHTML = "Successfully Updated";
            console.log(_('#updateSuccess').style.display)
            location.replace("dashboard.html")
        }).catch(function (err) {
            console.log(err.response)
        })
    })
}
/*Delete Goal*/
function deleteGoal(goalId) {
    const deleteGoalUrl = `https://goalsetapp.herokuapp.com/api/goals/${goalId}/delete`;
    const token = localStorage.getItem("goaltoken");
    const options = {
        headers: {
            Authorization: token,
        }
    }
    console.log(_(`#delete-goal-btn${goalId}`))
    _(`#delete-goal-btn${goalId}`).innerHTML = "deleting";
    _(`#delete-goal-btn${goalId}`).disabled = "true";
    axios.delete(deleteGoalUrl, options).then(function (response) {

        console.log(response.data);
        location.reload();
    }).catch(function (err) {
        console.log(err.response)
    })
}
/*Log Out*/
function logout() {
    localStorage.removeItem("goaltoken");
    location.replace("signin.html")


}
/*Add tasks*/
const addTaskForm = _("#add-task-form");


if (addTaskForm) {
    _('#loading-gif').style.display = "none";
    console.log('work')
    addTaskForm.addEventListener('submit', function (e) {
        _('#loading-gif').style.display = "block";
        console.log("after submit")
        e.preventDefault();
        _('#add-task-btn').disabled = "true";
        //document.getElementById("add-task-btn").classList.toggle("disabled");
        //_('#loading-gif').style.display = "block";

        const taskname = _("#taskname").value;

        const taskData = {
            taskname: taskname,
        }

        const addTaskUrl = `http://goalsetapp.herokuapp.com/api/goals/${goalId}/createtask`;
        const token = localStorage.getItem("goaltoken");

        // console.log(token)

        const options = {
            headers: {
                Authorization: token,
            }
        }

        axios.post(addTaskUrl, taskData, options).then(function (response) {
            _('#loading-gif').style.display = "none";
            console.log(response.data);
            console.log("added successfully")
            const newtask = response.data.data.task

            let tasknode = `
            <div class="input-group">
                <li class="list-group-item list-css text-left col-11 goal-list my-2">
                    <span class="col-6">${newtask.taskname}</span>
                </li> 
                <img src="Images/rubbish-bin.svg" style="width:20px" onClick="deleteTask(${goalId}, ${newtask.tid})">
            </div>
            
       
                `;
                _('#add-task-btn').disabled = "";

            // _('#loading-gif').style.display = "none";


            $('#tasks').prepend($(tasknode));
            document.getElementById("add-task-btn").classList.toggle("disabled");
            _('#add-task-btn').disabled = "";

        }).catch(function (err) {
            console.log(err)
            console.log(err.response);
            if(err.response.data.hasOwnProperty("taskname")){
                let message = err.response.data.taskname[0];
                _("#err-tname").innerHTML = `${message}`;
            }
            _('#loading-gif').style.display = "none";
            _('#add-task-btn').disabled = "";
        })
    })
}
/*View Tasks*/
// let urlParams = new URLSearchParams(location.search);
// let goalId = urlParams.get('id');
const fullTasks = _("#full-tasks");
console.log(_("#full-tasks"))

if (fullTasks) {
    
    console.log("it's here")
    const showTaskUrl = `http://goalsetapp.herokuapp.com/api/goals/${goalId}/tasks`;
    const token = localStorage.getItem("goaltoken");
    console.log(token)


    const options = {
        headers: {
            Authorization: token,
        }
    }

    axios.get(showTaskUrl, options).then(function (response) {
        console.log(response.data)
        const task = response.data.data.tasks;
        localStorage.setItem('task', task)
        console.log('task is' + task)

        

        for (let usertasks of task) {
            tasks.innerHTML += `
            <div class="input-group">
                
                <li class="list-group-item list-css text-left col-11 goal-list my-2">
                    <span class="col-6">${usertasks.taskname}</span>
                </li> 
                <img src="Images/rubbish-bin.svg" style="width:20px" onClick="deleteTask(${goalId}, ${usertasks.tid})">
            </div>
            
                `;
        }





    })

}
/*Delete Task*/
//let taskId = ;
function deleteTask(goalId, taskId) {
    console.log(goalId, taskId)
    const deleteTaskUrl = `https://goalsetapp.herokuapp.com/api/goals/${goalId}/tasks/${taskId}/delete`;
    const token = localStorage.getItem("goaltoken");
    const options = {
        headers: {
            Authorization: token,
        }
    }
    //_(`#delete-goal-btn${goalId}`).disabled = "true";
    axios.delete(deleteTaskUrl, options).then(function (response) {

        console.log(response.data);
        location.reload();
    }).catch(function (err) {
        console.log(err.response)
    })
}