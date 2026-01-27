import Card from "../components/Card";

const HomePage = () => {
    // const name: string = 'Shahriyor';
    // const people: any[] = [
    //   {
    //     id: 1,
    //     name: 'Shahriyor'
    //   },
    //   {
    //     id: 2,
    //     name: 'Barry'
    //   },
    //   {
    //     id: 3,
    //     name: 'Pau'
    //   },
    //   {
    //     id: 4,
    //     name: 'Lance'
    //   }
    // ];
    // const toggle: boolean = true;
    return (
        <>
            {/* <div className="text-2xl">App</div>
            <p>Hello, {name}!</p>
            <ul>
              {people.map((person) => (
                <li key={person.id}>{ person.name }</li>
              ))}
            </ul>
            { toggle && <span>Hi!</span> } */}
            <Card child={true} />
        </>
    )
}

export default HomePage;