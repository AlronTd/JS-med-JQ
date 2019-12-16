$(function() {
    async function main() {
        'use strict';
        
        
        //messages
        async function getMessages(){
          messages = await fetch('https://inlupp-fa.azurewebsites.net/api/messages').then((res) => {
            console.log('messages retrieved.')
            return res.json()
          }).catch((error) => console.error(`could not retrieve messages. error: "${error.message}"`))
          for(let message of messages){
            console.log(`adding message from ${message.from}.`)
            let newElem = document.createElement('a')
            newElem.innerHTML = 
                    `<div class="preview-thumbnail">
                        <img src="https://via.placeholder.com/36x36" alt="image" class="profile-pic">
                    </div>
                    <div class="preview-item-content flex-grow">
                      <h6 class="preview-subject ellipsis font-weight-normal">${message.from}
                      </h6>
                      <p class="font-weight-light small-text text-muted mb-0">
                        ${message.title}
                      </p>
                    </div>`;
            newElem.className = 'dropdown-item preview-item'
            document.querySelector('#messages').append(newElem)
          }
        }
        
        
        
        //notifications
        async function getNotifications(){
          notifications = await fetch('https://inlupp-fa.azurewebsites.net/api/notifications').then((res) => {
            console.log('notifications retrieved.')
            res = res.json()
            return res
          }).catch((error) => console.error(`could not retrieve notifications. error: "${error.message}"`))
          for(let notification of notifications){
            console.log(`adding ${notification.title} notification.`)
            let newElem = document.createElement('a')
            
            switch(notification.title){
              case 'Application Error':
                newElem.innerHTML = 
              `<div class="preview-thumbnail">
                <div class="preview-icon bg-success">
                  <i class="mdi mdi-information mx-0"></i>
                </div>
              </div>
              <div class="preview-item-content">
                <h6 class="preview-subject font-weight-normal">${notification.title}</h6>
                <p class="font-weight-light small-text mb-0 text-muted">
                  ${notification.subtitle}
                </p>
              </div>`
                break;
              case 'Settings':
                newElem.innerHTML = 
                `<div class="preview-thumbnail">
                  <div class="preview-icon bg-warning">
                    <i class="mdi mdi-settings mx-0"></i>
                  </div>
                </div>
                <div class="preview-item-content">
                  <h6 class="preview-subject font-weight-normal">${notification.title}</h6>
                  <p class="font-weight-light small-text mb-0 text-muted">
                    ${notification.subtitle}
                  </p>
                </div>`
                
                break;
              case 'New user registration':
                newElem.innerHTML = 
                `<div class="preview-thumbnail">
                <div class="preview-icon bg-info">
                  <i class="mdi mdi-account-box mx-0"></i>
                </div>
              </div>
              <div class="preview-item-content">
                <h6 class="preview-subject font-weight-normal">${notification.title}</h6>
                <p class="font-weight-light small-text mb-0 text-muted">
                  ${notification.subtitle}
                </p>
              </div>`
                break;
              default:
                newElem.innerHTML = 
                `<div class="preview-thumbnail">
                <div class="preview-icon">
                  <i class="mdi mx-0"></i>
                </div>
              </div>
              <div class="preview-item-content">
                <h6 class="preview-subject font-weight-normal">${notification.title}</h6>
                <p class="font-weight-light small-text mb-0 text-muted">
                  ${notification.subtitle}
                </p>
              </div>`
              
                break;
            }
            
            newElem.className = 'dropdown-item preview-item'
            document.querySelector('#notifications').append(newElem)
          }
        }
        
        
        
        
        
        
        //gets value for one of the four total boxes that display an amount of money.
        async function getTotal(whichTotal){
          let total = await fetch('https://inlupp-fa.azurewebsites.net/api/total-' + whichTotal).then((res) => {
            console.log('total ' + whichTotal + ' retrieved.')
            return res.json()
          }).catch((error) => console.error(`could not retrieve total ${whichTotal}. error: "${error.message}"`))
            total = `${total.currency}${total.amount}`
            console.log(`setting total ${whichTotal} to  ${total}`)
            document.querySelector('#total-' + whichTotal).innerHTML = total
        }
        
        
        getMessages()
        getNotifications()
        getTotal('growth')
        getTotal('sales')
        getTotal('orders')
        getTotal('purchases')
        
        
    }
    main();
});




        // //total growth
        // async function getTotalGrowth(){
        //   let growth = await fetch('https://inlupp-fa.azurewebsites.net/api/total-growth').then((res) => {
        //     console.log('total growth retrieved.')
        //     return res.json()
        //   }).catch((error) => console.error(`could not retrieve total growth. error: "${error.message}"`))
        //     growth = `${growth.currency}${growth.amount}`
        //     console.log('setting total growth to ' + growth)
        //     document.querySelector('#total-growth').innerHTML = growth
        // }
        
        
        // //total sales
        // async function getTotalSales(){
        //   let sales = await fetch('https://inlupp-fa.azurewebsites.net/api/total-sales').then((res) => {
        //     console.log('total sales retrieved.')
        //     return res.json()
        //   }).catch((error) => console.error(`could not retrieve total sales. error: "${error.message}"`))
        //     sales = `${sales.currency}${sales.amount}`
        //     console.log('setting total sales to ' + sales)
        //     document.querySelector('#total-sales').innerHTML = sales
        // }
        
        // async function getDownloads() {
        //   let downloads = await fetch('https://inlupp-fa.azurewebsites.net/api/downloads').then((res) => {
        //     console.log('downloads retrieved.')
        //     return res.json()
        //   }).catch((error) => console.error(`could not retrieve downloads. error: "${error.message}"`))
            // for(values of res){
            //   if('offlineAmount' in values){
            //     let circle = 
            //     $('#offline-downloads').html(res.offlineAmount)
            //   }
            // }
        //     document.querySelector(`#`).innerHTML = total
        // }