type EmptyStateProps = {
    title: string,
    description?: string 
}

export function EmptyState(props: EmptyStateProps) {
    return <div className="flex  flex-col justify-center items-center gap-3 font-nunito py-4 px-2">
        <h3 className="text-2xl font-bold">{props.title}</h3>
        {props.description && (
            <p className="text-xl text-center font-light">{props.description}</p>
        )}
    </div>
}
