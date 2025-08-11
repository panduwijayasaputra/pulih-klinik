import * as React from 'react';
import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { ClientStatusEnum, ClientStatusLabels } from '@/types/enums';

const clientStatusBadgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      status: {
        [ClientStatusEnum.New]: 
          'border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200',
        [ClientStatusEnum.Assigned]: 
          'border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200',
        [ClientStatusEnum.Consultation]: 
          'border-transparent bg-orange-100 text-orange-800 hover:bg-orange-200',
        [ClientStatusEnum.Therapy]: 
          'border-transparent bg-green-100 text-green-800 hover:bg-green-200',
        [ClientStatusEnum.Done]: 
          'border-transparent bg-purple-100 text-purple-800 hover:bg-purple-200',
      },
    },
    defaultVariants: {
      status: ClientStatusEnum.New,
    },
  }
);

export interface ClientStatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof clientStatusBadgeVariants> {
  status: ClientStatusEnum;
}

const ClientStatusBadge = React.forwardRef<HTMLDivElement, ClientStatusBadgeProps>(
  ({ className, status, ...props }, ref) => {
    const label = ClientStatusLabels[status] || status;
    
    return (
      <div 
        ref={ref}
        className={cn(clientStatusBadgeVariants({ status }), className)} 
        {...props}
      >
        {label}
      </div>
    );
  }
);

ClientStatusBadge.displayName = 'ClientStatusBadge';

export { ClientStatusBadge, clientStatusBadgeVariants };