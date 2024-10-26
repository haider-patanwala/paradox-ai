import { useModal } from "@/lib/chatStore"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import Player from "./vid-layouts/player"

type Props = {}

function modalVid({}: Props) {
  const { isOpen, onClose, onOpen } = useModal()
  return (
    <Dialog open={isOpen} onOpenChange={isOpen ? onClose : onOpen}>
      <DialogContent className="min-w-[50rem] p-10 sm:max-w-[425px]">
        <Player video_src="https://www.youtube.com/watch?v=gxc5kvzoddE" />
        {/* <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  )
}

export default modalVid
