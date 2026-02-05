"""add_location_coordinates_to_user_and_theater

Revision ID: a5eb76bdcc56
Revises: 838542f78a1d
Create Date: 2026-02-05 02:18:54.549022

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a5eb76bdcc56'
down_revision: Union[str, None] = '838542f78a1d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add location columns to users table
    op.add_column('users', sa.Column('latitude', sa.Numeric(precision=10, scale=8), nullable=True))
    op.add_column('users', sa.Column('longitude', sa.Numeric(precision=11, scale=8), nullable=True))
    op.add_column('users', sa.Column('city', sa.String(length=100), nullable=True))
    
    # Add location columns to theaters table
    op.add_column('theaters', sa.Column('latitude', sa.Numeric(precision=10, scale=8), nullable=True))
    op.add_column('theaters', sa.Column('longitude', sa.Numeric(precision=11, scale=8), nullable=True))


def downgrade() -> None:
    # Remove location columns from theaters table
    op.drop_column('theaters', 'longitude')
    op.drop_column('theaters', 'latitude')
    
    # Remove location columns from users table
    op.drop_column('users', 'city')
    op.drop_column('users', 'longitude')
    op.drop_column('users', 'latitude')
