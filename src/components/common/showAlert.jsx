import './showAlert.scss'

export default function showAlert (text, error, context) {
    context.current.style.transform = 'translateX(-50%) translateY(0%)'
    context.current.style.visibility = 'visible'
    context.current.style.opacity = '1'

    if (!error) {
        context.current.style.border = '2px solid rgb(0,255,0)'
        context.current.style.color = 'rgb(0, 255, 0)'
    } else {
        context.current.style.border = '2px solid rgb(255,0,0)'
        context.current.style.color = 'rgb(255,0,0)'
    }

    setTimeout(() => {
        context.current.style.transform = 'translateX(-50%) translateY(-100%)'
        context.current.style.visibility = 'hidden'
        context.current.style.opacity = '0'
    }, 2000)

    context.current.innerHTML = text
}