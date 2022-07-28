import { Button, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";

interface CommentFormProps {
    commentId?: string,
    body?: string,
    onSubmit: ({ body }: { body: string }) => Promise<boolean>,
    onCancel?: () => void,
};

export const CommentForm = ({ commentId, body, onSubmit, onCancel }: CommentFormProps) => {
    const formContext = useForm<{ body: string }>({
        defaultValues: {
            body: body ?? ''
        }
    });

    const confirmLabel = commentId ? 'Edit Comment' : 'Add Comment';

    const onSuccess = async (formData: { body: string }) => {
        if (await onSubmit(formData)) {
            formContext.reset();
        }
    };

    return (
        <FormContainer
            formContext={formContext}
            onSuccess={onSuccess}
        >
            <Stack direction="column" spacing={2} sx={{ m: 1, mb: 3 }}>
                <TextFieldElement id="body" label="Add your comment..." name="body" validation={{ required: 'Comment cannot be empty' }}
                    variant="outlined" fullWidth multiline minRows={1} />
                <Stack spacing={1} direction="row-reverse">
                    <Button type="submit" variant="contained" size="medium">{confirmLabel}</Button>
                    {onCancel
                        ? <Button variant="outlined" size="medium" onClick={onCancel}>Cancel</Button>
                        : ''
                    }
                </Stack>
            </Stack>
        </FormContainer>
    );
}

