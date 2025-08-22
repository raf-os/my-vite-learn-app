import * as Menubar from "@radix-ui/react-menubar";
import { ModalSingleton } from "./Modal";
import AboutModal from "./modal-messages/About";
import { cn } from "@/lib/utils";

export default function AppMenuBar() {
    const onAboutPressed = () => {
        ModalSingleton.create(AboutModal);
    }

    return (
        <Menubar.Root className="menubar">

            <MenuMenu label="Help">
                <MenuItem onSelect={onAboutPressed}>
                    About
                </MenuItem>
            </MenuMenu>
            
        </Menubar.Root>
    )
}

function MenuMenu({
    children,
    className,
    label,
    ...rest
}: React.ComponentPropsWithRef<typeof Menubar.Trigger> & { label: React.ReactNode }) {
    return (
        <Menubar.Menu>
            <Menubar.Trigger
                className={cn(
                    "menutrigger",
                    className
                )}
                {...rest}
            >
                { label }
            </Menubar.Trigger>
            <Menubar.Portal>
                <Menubar.Content className="menucontent">
                    { children }
                </Menubar.Content>
            </Menubar.Portal>
        </Menubar.Menu>
    )
}

function MenuItem({
    children,
    className,
    ...rest
}: React.ComponentPropsWithRef<typeof Menubar.Item>){
    return (
        <Menubar.Item
            className={cn("menuitem", className)}
            {...rest}
        >
            { children }
        </Menubar.Item>
    )
}