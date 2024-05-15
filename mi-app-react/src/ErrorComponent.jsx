import dog from './images/confused_dog.webp';

export default function ErrorComponent() {
    return (
        <div>
            <h1>Error 404: Page not found!</h1>
            <div style={{width: '100%'}}>
                <img src={dog} alt="Confused dog" style={{height: '500px', width: '500px', display:'block', marginLeft: 'auto', marginRight: 'auto'}} />
            </div>
        </div>
    )
}